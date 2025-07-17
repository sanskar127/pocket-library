import crypto from 'crypto';
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { cacheDir } from './constants';

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

// Check if thumbnail exists and is valid (e.g., >1KB)
const thumbnailExistsAndValid = (filePath: string): boolean => {
  try {
    const stats = fs.statSync(filePath);
    return stats.isFile() && stats.size > 1024; // >1KB is an arbitrary validity check
  } catch {
    return false;
  }
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

export const getThumbnail = async (videoFullPath: string): Promise<string> => {
  const safeName = sanitizeFileName(path.basename(videoFullPath)).replace(/\.mp4$/i, '.webp');
  const thumbPath = path.join(cacheDir, safeName);

  try {
    if (!thumbnailExistsAndValid(thumbPath)) {
      await generateThumbnail(videoFullPath, thumbPath);
      console.log(`✅ Thumbnail created: ${safeName}`);
    } else {
      console.log(`🟢 Thumbnail already exists: ${safeName}`);
    }

    const relativePath = path.relative(cacheDir, thumbPath)
    
    return `/thumbnails/${relativePath}`;
  } catch (error: any) {
    console.error(`❌ Failed to create thumbnail for ${videoFullPath}: ${error.message}`);
    throw error;
  }
};
