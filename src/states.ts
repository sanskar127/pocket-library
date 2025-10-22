import path from 'path';
import { ImageExtension, mediaInterface, VideoExtension } from './types';

// [pathname] : ["entry1", entry2,...]

// Constant Directories
export const mediaDir: string = process.cwd();
export const cacheDir: string = path.join(mediaDir, '.cache');
export const thumbnailsDir: string = path.join(cacheDir, 'thumbnails')
export const playbackDir: string = path.join(cacheDir, 'playback');
export const cachingFile = path.join(cacheDir, 'metadata.json')

export let media: mediaInterface = {};
export function setMedia(data: mediaInterface) { media = { ...media, ...data } }

export let chunkedData: string[] = [];
export function setChunkedData(data: string[] | null) {
  if (data === null) chunkedData = [];
  else chunkedData = [...chunkedData, ...data];
}

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
