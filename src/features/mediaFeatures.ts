import path, { relative, basename, extname, join, dirname } from "path";
import { readdir, stat } from 'fs/promises'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { thumbnailsDir, imageFormats, media, videoFormats, mediaDir } from "../states";
import { generateShortId, generateThumbnail, sanitizeFileName, thumbnailExistsAndValid } from "../utils";
import { ChunkInterface, ScanImagesInterface, ScanVideosInterface, VideoInterface, VideoMetadata } from "../types";
import { exec } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import Ffmpeg from "fluent-ffmpeg";

// Retrieve video details and create a response object for a video file
export const scanVideos: ScanVideosInterface = async (filepath, extension) => {
  try {
    const { mtimeMs, size, mtime } = await stat(filepath);
    const { width, height, duration } = await getVideoMetadata(filepath);
    const thumbnail = await getThumbnail(filepath, duration);
    const relativeFilePath = relative(mediaDir, filepath).replace(/\\/g, '/');

    return {
      id: generateShortId(relativeFilePath + mtimeMs),
      name: basename(filepath, extension),
      size,
      modifiedAt: mtime,
      type: videoFormats[extension],
      duration,
      width,
      height,
      url: `/media/${relativeFilePath}`,
      thumbnail
    };
  } catch (error) {
    console.error(`Error processing video ${filepath}:`, error);
    return null;  // Returning null for failed video processing
  }
};

// Retrieve video details and create a response object for a video file
export const scanImages: ScanImagesInterface = async (filepath, extension) => {
  try {
    const relativeFilePath = path.relative(mediaDir, filepath).replace(/\\/g, '/');
    const stats = await stat(filepath);

    return {
      id: generateShortId(relativeFilePath + stats.mtimeMs),
      name: path.basename(filepath, extension),
      size: stats.size,
      modifiedAt: stats.mtime,
      type: imageFormats[extension],
      url: `/media/${relativeFilePath}`,
      thumbnail: `/media/${relativeFilePath}`
    };
  } catch (error) {
    console.error(`Error processing video ${filepath}:`, error);
    return null;  // Returning null for failed video processing
  }
};

export const mediaChecker = async (targetPath: string): Promise<boolean> => {
  try {
    const stats = await stat(targetPath);

    // Skip .cache or hidden dirs
    if (path.basename(targetPath).startsWith('.') || path.basename(targetPath) === '.cache') {
      return false;
    }

    // If it's a supported video file
    const ext = path.extname(targetPath).toLowerCase();
    if (stats.isFile() && (videoFormats.hasOwnProperty(ext) || imageFormats.hasOwnProperty(ext))) {
      return true;
    }

    // If it's a directory, scan its contents recursively
    if (stats.isDirectory()) {
      const entries = await readdir(targetPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(targetPath, entry.name);

        // Recursively check subdirectories and files
        if (await mediaChecker(fullPath)) {
          return true;
        }
      }
    }

    return false; // No valid media found
  } catch (error) {
    console.error(`Error in mediaChecker for path ${targetPath}:`, error);
    return false;
  }
};

// Get video width, height and duration in seconds
export const getVideoMetadata = (videoFullPath: string): Promise<VideoMetadata> => {
  return new Promise((resolve, reject) => {
    const command = `"${ffmpegPath}" -i "${videoFullPath}" -v quiet -print_format json -show_format -show_streams`;

    exec(command, (err, stdout, stderr) => {
      if (err) { // Check if err is not null or undefined
        reject(new Error(`FFmpeg error: ${stderr || err.message}`));
        return;
      }

      try {
        const metadata = JSON.parse(stdout);
        const videoStream = metadata.streams.find((s: any) => s.codec_type === 'video');
        if (!videoStream || typeof metadata.format.duration !== 'number') {
          reject(new Error('Video stream or duration not found'));
          return;
        }

        const width = videoStream.width || 0;
        const height = videoStream.height || 0;
        const duration = metadata.format.duration;

        resolve({ duration, width, height });
      } catch (parseError: unknown) { // Handle unknown error type properly
        if (parseError instanceof Error) {
          reject(new Error(`Error parsing metadata: ${parseError.message}`));
        } else {
          reject(new Error('Unknown error while parsing metadata'));
        }
      }
    });
  });
};

// Get thumbnail for a video, creating it if necessary
export const getThumbnail = async (videoFullPath: string, duration: number): Promise<string> => {
  try {
    const ext = extname(videoFullPath);
    const relative = path.relative(mediaDir, videoFullPath).replace(/\\/g, '/');
    const dir = join(thumbnailsDir, path.dirname(relative));
    const thumbPath = join(dir, `${sanitizeFileName(path.basename(videoFullPath, ext))}.webp`);

    return `/thumbnails/${path.relative(thumbnailsDir, thumbPath).replace(/\\/g, '/')}`;
  } catch (error: any) {
    console.error(`❌ Failed to create thumbnail for ${videoFullPath}: ${error.message}`);
    throw error;
  }
};

export const getChunk: ChunkInterface = async (pathname, limit, offset) => {
  const entries = media[pathname];
  const hasMore = offset + limit < entries.length;

  if (entries.length <= limit) return { data: entries, hasMore: false };

  let data = entries.slice(offset, offset + limit);

  // Wait for all thumbnail generation tasks to complete
  await Promise.all(data.map(async (item) => {
    const { type, duration, url, thumbnail } = item as VideoInterface;

    if (type.startsWith('video/')) {
      const videoPath = join(mediaDir, url.replace('/media', ''));
      const thumbnailPath = join(thumbnailsDir, thumbnail.replace('/thumbnails', ''));
      const thumbnailDirectory = dirname(thumbnailPath);

      if (!existsSync(thumbnailDirectory)) mkdirSync(thumbnailDirectory, { recursive: true });
      if (!thumbnailExistsAndValid(thumbnailPath)) { await generateThumbnail(videoPath, thumbnailPath, duration); }
    }
  }));

  return { data, hasMore };
};

// Utility to check and return the limit validation result
export const validateLimit = (limit: number): boolean => !isNaN(limit) && limit > 0;

// Unfinished for HLS
export const transcodingHLS = async (videoFile: string, outputDir: string): Promise<string> => {
  const lockFile = path.join(outputDir, '.lock');
  const doneFile = path.join(outputDir, '.done');
  const metaFile = path.join(outputDir, '.meta.json');

  if (existsSync(lockFile)) {
    throw new Error('Transcoding is already in progress.');
  }

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(lockFile, ''); // Mark as in-progress

  try {
    let startSegment = 0;

    // Resume if metadata exists
    if (existsSync(metaFile)) {
      const meta = JSON.parse(readFileSync(metaFile, 'utf-8'));
      startSegment = meta.lastSegment + 1;
    }

    const segmentPattern = path.join(outputDir, '%03d.ts');
    const playlistPath = path.join(outputDir, 'playlist.m3u8');

    await new Promise<void>((resolve, reject) => {
      Ffmpeg(videoFile)
        .videoFilters('format=yuv420p')
        .outputOptions([
          '-c:v', 'libx264',
          '-level', '4.0',
          '-start_number', String(startSegment),
          '-hls_time', '10',
          '-hls_list_size', '0',
          '-hls_flags', '+append_list',
          '-f', 'hls',
          '-hls_segment_filename', segmentPattern,
        ])
        .output(playlistPath)
        .on('start', (cmd) => {
          console.log('FFmpeg command:', cmd);
        })
        .on('stderr', (line) => {
          console.log('FFmpeg stderr:', line);
        })
        .on('end', () => {
          console.log('✅ Transcoding finished');
          // Update meta file
          const tsFiles = readdirSync(outputDir).filter(f => f.endsWith('.ts'));
          const lastSegment = Math.max(...tsFiles.map(f => parseInt(f.replace('.ts', ''))));
          writeFileSync(metaFile, JSON.stringify({ lastSegment }, null, 2));

          // Mark done
          writeFileSync(doneFile, 'done');
          resolve();
        })
        .on('error', (err) => {
          console.error('❌ FFmpeg error:', err.message);
          reject(err);
        })
        .run();
    });

    return outputDir;
  } finally {
    if (existsSync(lockFile)) {
      rmSync(lockFile);
    }
  }
};
