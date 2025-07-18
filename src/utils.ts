import crypto from 'crypto';
import fs from 'fs'
import { readdir, stat } from 'fs/promises'
import os from 'os'
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { cacheDir, videosDir } from './constants';
import qrcode from 'qrcode-terminal';
import { ScanVideosInterface } from './types';

// Sanitize file names for Windows (and general safety)
const sanitizeFileName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9\-_.]/g, '_');
}

export const generateShortId = (input: string): string => {
  return crypto
    .createHash('sha1')
    .update(input)
    .digest('base64')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase()
    .slice(0, 8);
}

// Get video duration in seconds
export const getDuration = (videoFullPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoFullPath, (err, metadata) => {
      if (err) return reject(err);
      resolve(typeof metadata.format.duration === 'number' ? metadata.format.duration : 0);
    });
  });
};


export const mediaChecker = async (dir: string): Promise<boolean> => {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const found = await mediaChecker(fullPath);
      if (found) return true; // Stop early if found
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.mp4') {
      return true;
    }
  }

  return false;
}

// Check if thumbnail exists and is valid (e.g., >1KB)
const thumbnailExistsAndValid = (filePath: string): boolean => {
  try {
    const stats = fs.statSync(filePath);
    return stats.isFile() && stats.size > 1024; // >1KB is an arbitrary validity check
  } catch {
    return false;
  }
};

// Function to get the local IP address of the machine
export const getLocalIPAddress = (): string => {
  const networkInterfaces = os.networkInterfaces();
  for (let interfaceName in networkInterfaces) {
    for (let interfaceInfo of networkInterfaces[interfaceName]!) {
      if (!interfaceInfo.internal && interfaceInfo.family === 'IPv4') {
        return interfaceInfo.address;
      }
    }
  }
  return '127.0.0.1';
}

// Generate thumbnail using ffmpeg
const generateThumbnail = (videoPath: string, outputPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .inputOptions(['-ss', '5']) // Seek to 5 seconds
      .outputOptions([
        '-vframes', '1',
        '-vf', 'scale=320:180',
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

export const getThumbnail = async (videoFullPath: string): Promise<string> => {
  const safeName = sanitizeFileName(path.basename(videoFullPath)).replace(/\.mp4$/i, '.webp');
  const thumbPath = path.join(cacheDir, safeName);

  try {
    if (!thumbnailExistsAndValid(thumbPath))
      await generateThumbnail(videoFullPath, thumbPath);

    const relativePath = path.relative(cacheDir, thumbPath)

    return `/thumbnails/${relativePath}`;
  } catch (error: any) {
    console.error(`❌ Failed to create thumbnail for ${videoFullPath}: ${error.message}`);
    throw error;
  }
};

// Retrieve Videos from current Directory
export const scanVideos: ScanVideosInterface = async (filepath, extension) => {
  try {
    const relativeFilePath = path.relative(videosDir, filepath).replace(/\\/g, '/');
    const stats = await stat(filepath);
    const duration = await getDuration(filepath);
    const thumbnail = await getThumbnail(filepath)

    return {
      id: generateShortId(relativeFilePath + stats.mtimeMs),
      name: path.basename(filepath, extension),
      size: stats.size,
      modifiedAt: stats.mtime,
      type: "video/mp4",
      duration,
      url: `/videos/${relativeFilePath}`,
      thumbnail
    };
  } catch (error) {
    console.error(`Error processing video ${filepath}:`, error);
    return null;  // Returning null for failed video processing
  }
};

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
}
