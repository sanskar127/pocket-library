import { cacheDir, videosDir, entries, isOffsetReset, chunkedData, setChunkedData, setEntries, playbackDir } from './states';
import { ChunkInterface, GetInitialLength, ScanVideosInterface, VideoExtension, ImageExtension, ScanImagesInterface, VideoMetadata } from './types';
import { stat, readdir, mkdir } from 'fs/promises';
import qrcode from 'qrcode-terminal';
import ffmpeg from 'fluent-ffmpeg';
import crypto from 'crypto';
import path from 'path';
import fs, { existsSync } from 'fs';
import os from 'os';

// Sanitize file names for Windows (and general safety)
const sanitizeFileName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9\-_.]/g, '_');
};

export const videoFormats: Record<VideoExtension, string> = {
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".avi": "video/avi",
  ".mkv": "video/x-matroska",
  ".wmv": "video/x-ms-wmv",
  ".flv": "video/x-flv",
  ".f4v": "video/mp4",
  ".webm": "video/webm",
  ".mpeg": "video/mpeg",
  ".mpg": "video/mpeg",
};

export const imageFormats: Record<ImageExtension, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".bmp": "image/bmp",
  ".tiff": "image/tiff",
  ".tif": "image/tiff",
  ".svg": "image/svg+xml"
};

// Utility to check and return the limit validation result
export const validateLimit = (limit: number): boolean => !isNaN(limit) && limit > 0;

// Generate short ID from a given input
export const generateShortId = (input: string): string => {
  return crypto
    .createHash('sha1')
    .update(input)
    .digest('base64')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase()
    .slice(0, 8);
};

// Get video width, height and duration in seconds
export const getVideoMetadata = (videoFullPath: string): Promise<VideoMetadata> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoFullPath, (err, metadata) => {
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

// Check if thumbnail exists and is valid (size >1KB)
const thumbnailExistsAndValid = (filePath: string): boolean => {
  try {
    const stats = fs.statSync(filePath);
    return stats.isFile() && stats.size > 1024; // >1KB is an arbitrary validity check
  } catch {
    return false;
  }
};

// Retrieve local machine's IP address
export const getLocalIPAddress = (): string | null => {
  const inc = /eth|en|wlan|wl|wifi|usb|rndis|rmnet|ecm|wi-fi|ethernet|local area/i;
  const exc = /loopback|vmnet|vbox|virtual|hyper|vpn|br-|docker|nat|host|tap|tun|veth|bridge/i;

  for (const name in os.networkInterfaces()) {
    if (inc.test(name) && !exc.test(name)) {
      for (const { address, family, internal } of os.networkInterfaces()[name] || []) {
        if (family === 'IPv4' && !internal) return address;
      }
    }
  }
  return null;
};

// Generate thumbnail using ffmpeg
const generateThumbnail = (videoPath: string, outputPath: string, duration: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const seekTime = Math.floor(duration / 2);

    ffmpeg(videoPath)
      .inputOptions(['-ss', String(seekTime)])
      .outputOptions([
        '-vframes', '1',
        '-vf', 'scale=480:270:force_original_aspect_ratio=decrease', // <-- updated scale filter
        '-c:v', 'libwebp',
        '-qscale:v', '80',
        '-preset', 'default'
      ])
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(new Error(`FFmpeg error: ${err.message}`)))
      .run();
  });
};

// Get thumbnail for a video, creating it if necessary
export const getThumbnail = async (videoFullPath: string, duration: number): Promise<string> => {
  try {
    const ext = path.extname(videoFullPath);
    const relative = path.relative(videosDir, videoFullPath).replace(/\\/g, '/');
    const dir = path.join(cacheDir, path.dirname(relative));
    const thumbPath = path.join(dir, `${sanitizeFileName(path.basename(videoFullPath, ext))}.webp`);

    if (!existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (!thumbnailExistsAndValid(thumbPath)) {
      await generateThumbnail(videoFullPath, thumbPath, duration);
    }

    return `/thumbnails/${path.relative(cacheDir, thumbPath).replace(/\\/g, '/')}`;
  } catch (error: any) {
    console.error(`❌ Failed to create thumbnail for ${videoFullPath}: ${error.message}`);
    throw error;
  }
};

// Retrieve video details and create a response object for a video file
export const scanImages: ScanImagesInterface = async (filepath, extension) => {
  try {
    const relativeFilePath = path.relative(videosDir, filepath).replace(/\\/g, '/');
    const stats = await stat(filepath);

    return {
      id: generateShortId(relativeFilePath + stats.mtimeMs),
      name: path.basename(filepath, extension),
      size: stats.size,
      modifiedAt: stats.mtime,
      type: imageFormats[extension],
      url: `/videos/${relativeFilePath}`,
      thumbnail: `/videos/${relativeFilePath}`
    };
  } catch (error) {
    console.error(`Error processing video ${filepath}:`, error);
    return null;  // Returning null for failed video processing
  }
};

// Function to convert videos to MP4
export async function convertToMP4(inputFilePath: string, outputFilePath: string) {
  try {
    // Extract directory path of the output file
    const outputDir = path.dirname(outputFilePath);

    // Ensure the output directory exists
    await mkdir(outputDir, { recursive: true });

    // Start conversion
    ffmpeg(inputFilePath)
      .output(outputFilePath)
      .videoCodec('libx264')  // H.264 codec for MP4
      .audioCodec('aac')  // AAC audio codec for MP4
      .on('start', commandLine => {
        console.log(`FFmpeg command: ${commandLine}`);
      })
      .on('end', () => {
        console.log(`Conversion finished: ${outputFilePath}`);
      })
      .on('error', (err) => {
        console.error(`Error during conversion: ${err.message}`);
      })
      .run();
  } catch (err: any) {
    console.error(`Failed to create directory for output file: ${err.message}`);
  }
}

export const transcodingHLS = async (videoFile: string, outputDir: string): Promise<string> => {
  const lockFile = path.join(outputDir, '.lock');
  const doneFile = path.join(outputDir, '.done');
  const metaFile = path.join(outputDir, '.meta.json');

  if (fs.existsSync(lockFile)) {
    throw new Error('Transcoding is already in progress.');
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(lockFile, ''); // Mark as in-progress

  try {
    let startSegment = 0;

    // Resume if metadata exists
    if (fs.existsSync(metaFile)) {
      const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
      startSegment = meta.lastSegment + 1;
    }

    const segmentPattern = path.join(outputDir, '%03d.ts');
    const playlistPath = path.join(outputDir, 'playlist.m3u8');

    await new Promise<void>((resolve, reject) => {
      ffmpeg(videoFile)
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
          const tsFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.ts'));
          const lastSegment = Math.max(...tsFiles.map(f => parseInt(f.replace('.ts', ''))));
          fs.writeFileSync(metaFile, JSON.stringify({ lastSegment }, null, 2));

          // Mark done
          fs.writeFileSync(doneFile, 'done');
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
    if (fs.existsSync(lockFile)) {
      fs.rmSync(lockFile);
    }
  }
};

// Retrieve video details and create a response object for a video file
export const scanVideos: ScanVideosInterface = async (filepath, extension) => {
  try {
    const {mtimeMs, size, mtime} = await stat(filepath);
    const {width, height, duration} = await getVideoMetadata(filepath);
    const thumbnail = await getThumbnail(filepath, duration);
    const relativeFilePath = path.relative(videosDir, filepath).replace(/\\/g, '/');

    return {
      id: generateShortId(relativeFilePath + mtimeMs),
      name: path.basename(filepath, extension),
      size,
      modifiedAt: mtime,
      type: videoFormats[extension],
      duration,
      width,
      height,
      url: `/videos/${relativeFilePath}`,
      thumbnail
    };
  } catch (error) {
    console.error(`Error processing video ${filepath}:`, error);
    return null;  // Returning null for failed video processing
  }
};

export async function setMediaFiles(navigationPath: string) {
  setEntries(null);
  let statsEntries: Array<{ item: string, mtime: Date } | null> = [];

  try {
    const items = await readdir(navigationPath);
    statsEntries = await Promise.all(items.map(async item => {
      try {
        const filePath = path.join(navigationPath, item);
        if (await mediaChecker(filePath)) {
          const { mtime } = await stat(filePath);
          return { item, mtime };
        }
      } catch (error) {
        console.error(`Error processing file ${item}:`, error);
      }
      return null;
    }));
  } catch (error) {
    console.error('Error reading directory:', error);
  }

  const validEntries = statsEntries.filter(entry => entry !== null);
  validEntries.sort((a, b) => b.mtime.getTime() - a.mtime.getTime()).forEach(({ item }) => setEntries(item));
}


const getLimit: GetInitialLength = (device) => {
  if (device === 'mobile') return { initialLimit: 3, limit: 2 };
  if (device === 'tablet') return { initialLimit: 10, limit: 2 };
  if (device === 'laptop') return { initialLimit: 20, limit: 5 };
  if (device === 'desktop') return { initialLimit: 30, limit: 6 };

  return { initialLimit: -1, limit: -1 };
}

export const getChunk: ChunkInterface = (limit, offset) => {
  const hasMore = offset + limit < entries.length;

  if (isOffsetReset) setChunkedData(null);
  if (entries.length <= limit) return { chunk: entries, hasMore: false };

  let chunk = entries.slice(offset, offset + limit);

  if (chunkedData.length !== 0) chunk = chunk.filter(item => !chunkedData.includes(item));

  setChunkedData(chunk);
  return { chunk, hasMore };
};

// Generate QR code
export const generateQrCode = (data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    qrcode.generate(data, { small: true }, (qr) => {
      if (!qr) {
        reject('Error generating QR code');
      } else {
        resolve(qr);
      }
    });
  });
};
