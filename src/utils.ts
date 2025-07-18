import { cacheDir, videosDir } from './constants';
import { ScanVideosInterface } from './types';
import { readdir, stat } from 'fs/promises';
import qrcode from 'qrcode-terminal';
import ffmpeg from 'fluent-ffmpeg';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Sanitize file names for Windows (and general safety)
const sanitizeFileName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9\-_.]/g, '_');
};

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

// Get video duration in seconds
export const getDuration = (videoFullPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoFullPath, (err, metadata) => {
      if (err) return reject(err);
      resolve(typeof metadata.format.duration === 'number' ? metadata.format.duration : 0);
    });
  });
};

// Check if the directory contains any media (video files)
export const mediaChecker = async (dir: string): Promise<boolean> => {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = await mediaChecker(fullPath);
      if (found) return true;
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.mp4') {
      return true;
    }
  }

  return false;
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
export const getLocalIPAddress = (): string => {
  const networkInterfaces = os.networkInterfaces();
  for (let interfaceName in networkInterfaces) {
    for (let interfaceInfo of networkInterfaces[interfaceName]!) {
      // Skip internal interfaces, IPv6 addresses, VPN, WSL, VirtualBox interfaces
      if (
        !interfaceInfo.internal && 
        interfaceInfo.family === 'IPv4' && 
        !interfaceName.toLowerCase().includes('vpn') &&
        !interfaceName.toLowerCase().includes('vbox') &&
        !interfaceName.toLowerCase().includes('wsl') &&
        !interfaceInfo.address.startsWith('172.16.') && // Avoiding common private network IPs for VPNs
        !interfaceInfo.address.startsWith('10.') // Avoiding common private IPs used by VPNs and WSL
      ) {
        return interfaceInfo.address;
      }
    }
  }
  return '127.0.0.1';
};

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

// Get thumbnail for a video, creating it if necessary
export const getThumbnail = async (videoFullPath: string): Promise<string> => {
  const safeName = sanitizeFileName(path.basename(videoFullPath)).replace(/\.mp4$/i, '.webp');
  const thumbPath = path.join(cacheDir, safeName);

  try {
    if (!thumbnailExistsAndValid(thumbPath)) {
      await generateThumbnail(videoFullPath, thumbPath);
    }

    const relativePath = path.relative(cacheDir, thumbPath);
    return `/thumbnails/${relativePath}`;
  } catch (error: any) {
    console.error(`❌ Failed to create thumbnail for ${videoFullPath}: ${error.message}`);
    throw error;
  }
};

// Retrieve video details and create a response object for a video file
export const scanVideos: ScanVideosInterface = async (filepath, extension) => {
  try {
    const relativeFilePath = path.relative(videosDir, filepath).replace(/\\/g, '/');
    const stats = await stat(filepath);
    const duration = await getDuration(filepath);
    const thumbnail = await getThumbnail(filepath);

    return {
      id: generateShortId(relativeFilePath + stats.mtimeMs),
      name: path.basename(filepath, extension),
      size: stats.size,
      modifiedAt: stats.mtime,
      type: 'video/mp4',
      duration,
      url: `/videos/${relativeFilePath}`,
      thumbnail
    };
  } catch (error) {
    console.error(`Error processing video ${filepath}:`, error);
    return null;  // Returning null for failed video processing
  }
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
