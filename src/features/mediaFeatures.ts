import path, { relative, basename, extname, join } from "path";
import { readdir, stat } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import { cacheDir, imageFormats, videoFormats, videosDir } from "../constants";
import { generateShortId, generateThumbnail, sanitizeFileName, thumbnailExistsAndValid } from "../utils";
import { ScanImagesInterface, ScanVideosInterface, VideoMetadata } from "../types";
import Ffmpeg from "fluent-ffmpeg";

// Retrieve video details and create a response object for a video file
export const scanVideos: ScanVideosInterface = async (filepath, extension) => {
    try {
        const { mtimeMs, size, mtime } = await stat(filepath);
        const { width, height, duration } = await getVideoMetadata(filepath);
        // const thumbnail = await getThumbnail(filepath, duration);
        const relativeFilePath = relative(videosDir, filepath).replace(/\\/g, '/');

        return {
            id: generateShortId(relativeFilePath + mtimeMs),
            name: basename(filepath, extension),
            size,
            modifiedAt: mtime,
            type: videoFormats[extension],
            duration,
            width,
            height,
            url: `/videos/${relativeFilePath}`
        };
    } catch (error) {
        console.error(`Error processing video ${filepath}:`, error);
        return null;  // Returning null for failed video processing
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
        const relative = path.relative(videosDir, videoFullPath).replace(/\\/g, '/');
        const dir = join(cacheDir, path.dirname(relative));
        const thumbPath = join(dir, `${sanitizeFileName(path.basename(videoFullPath, ext))}.webp`);

        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

        if (!thumbnailExistsAndValid(thumbPath)) {
            await generateThumbnail(videoFullPath, thumbPath, duration);
        }

        return `/thumbnails/${path.relative(cacheDir, thumbPath).replace(/\\/g, '/')}`;
    } catch (error: any) {
        console.error(`❌ Failed to create thumbnail for ${videoFullPath}: ${error.message}`);
        throw error;
    }
};