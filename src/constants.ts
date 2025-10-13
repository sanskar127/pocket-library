import path from 'path';
import { ImageExtension, VideoExtension } from './types';

export const videosDir: string = process.cwd();
export const cacheDir: string = path.join(videosDir, '.cache');
export const playbackDir: string = path.join(cacheDir, 'playback');

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