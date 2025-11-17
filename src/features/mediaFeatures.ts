import path, { relative, basename, extname, join, resolve, dirname } from "path";
import { readdir, stat } from 'fs/promises'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { thumbnailsDir, imageFormats, media, videoFormats, mediaDir, setMedia } from "../states";
import { generateShortId, generateThumbnail, sanitizeFileName, thumbnailExistsAndValid, writeCacheData } from "../utils";
import { ChunkInterface, DirectoryInterface, ImageExtension, ItemType, ScanImagesInterface, ScanVideosInterface, VideoExtension, VideoInterface, VideoMetadata, sortInterface } from "../types";
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
    Ffmpeg.ffprobe(videoFullPath, (err, metadata) => {
      if (err) return reject(err);

      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      if (!videoStream || typeof metadata.format.duration !== 'number') {
        return reject(new Error('Video stream or duration not found'));
      }

      const width = videoStream.width || 0;
      const height = videoStream.height || 0;
      const duration = metadata.format.duration;

      resolve({ duration, width, height });
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

export const fetchMediaEntries = async (pathname: string): Promise<void> => {
  const items = await readdir(pathname);
  const entries = await Promise.all(items.map(async item => {
    try {
      const filePath = path.join(pathname, item);
      if (!await mediaChecker(filePath)) {
        return null;  // Skip non-media files
      }

      const currentPath = path.join(pathname, item);
      const stats = await stat(currentPath);

      if (stats.isDirectory()) {
        const name = path.basename(currentPath);
        return {
          id: generateShortId(path.relative(mediaDir, pathname) + stats.mtimeMs),
          name,
          size: -1,
          type: 'directory',
          modifiedAt: stats.mtime,
          url: name,
        } as DirectoryInterface;
      }

      const extname = path.extname(item).toLowerCase() as VideoExtension;

      if (videoFormats.hasOwnProperty(extname)) {
        try {
          return await scanVideos(currentPath, extname);
        } catch (videoError) {
          console.error(`Error scanning video at ${currentPath}:`, videoError);
          return { error: "Failed to process video" }; // Fallback return
        }
      }

      if (imageFormats.hasOwnProperty(extname)) {
        try {
          return await scanImages(currentPath, extname as ImageExtension);
        } catch (imageError) {
          console.error(`Error scanning image at ${currentPath}:`, imageError);
          return { error: "Failed to process image" }; // Fallback return
        }
      }

      return null;  // No match for video or image formats
    } catch (error) {
      console.error(`Error processing file ${item}:`, error);
      return { error: "Failed to process file" }; // Fallback return
    }
  })).then(entries => entries.filter(item => item !== null)) as ItemType[];

  setMedia({ [pathname]: entries })
  writeCacheData()
}

// Sorting logic for media
export const handleSort = (pathname: string, sorting: sortInterface) => {
  setMedia({
    [pathname]: media[pathname].sort((a, b) => {
      // First, check if sortDirectoryFirst is set
      if (sorting.sortDirectoryFirst) {
        // Directories first, files later
        if (a.type === 'directory' && b.type !== 'directory') return -1; // a is a directory, b is a file
        if (a.type !== 'directory' && b.type === 'directory') return 1;  // b is a directory, a is a file
      } else {
        // If sortDirectoryFirst is false, we want files first (default)
        if (a.type === 'directory' && b.type !== 'directory') return 1; // a is a directory, b is a file
        if (a.type !== 'directory' && b.type === 'directory') return -1; // b is a directory, a is a file
      }

      // Now apply sorting based on the requested type (name, date, size)
      const compare = (field: keyof ItemType) => {
        const valA = a[field];
        const valB = b[field];
        if (sorting.order === 'ascending') {
          return valA < valB ? -1 : valA > valB ? 1 : 0;
        } else {
          return valA > valB ? -1 : valA < valB ? 1 : 0;
        }
      };

      switch (sorting.type) {
        case 'name':
          return compare('name');
        case 'date':
          return compare('modifiedAt');
        case 'size':
          return compare('size');
        default:
          return 0;
      }
    })
  });
}
