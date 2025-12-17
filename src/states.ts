import path from 'path';
import { ImageExtension, ItemType, VideoExtension } from './types';

// [pathname] : ["entry1", entry2,...]

// Constant Directories
export const mediaDir: string = process.cwd();
export const cacheDir: string = path.join(mediaDir, '.cache');
export const thumbnailsDir: string = path.join(cacheDir, 'thumbnails')
export const playbackDir: string = path.join(cacheDir, 'playback');
export const cachingFile = path.join(cacheDir, 'metadata.json')

export let media: Record<string, ItemType[]> = {};
export function setMedia(data: Record<string, ItemType[]> | null) { 
  if (data) media = { ...media, ...data } 
  else media = {}
}

export const videoFormats: Record<VideoExtension, string> = {
  ".mp4": "video/mp4",                  // MP4 Video (Standard)
  ".mov": "video/quicktime",            // MOV Video (QuickTime format)
  ".avi": "video/x-msvideo",            // AVI Video (Microsoft's format)
  ".mkv": "video/x-matroska",           // MKV Video (Matroska format)
  ".wmv": "video/x-ms-wmv",             // WMV Video (Windows Media Video)
  ".flv": "video/x-flv",                // FLV Video (Flash Video)
  ".f4v": "video/mp4",                  // F4V (Flash MP4)
  ".webm": "video/webm",                // WebM (Open-source video format)
  ".mpeg": "video/mpeg",                // MPEG Video (Moving Picture Experts Group)
  ".mpg": "video/mpeg",                 // MPG Video (MPEG format)
};


export const imageFormats: Record<ImageExtension, string> = {
  ".jpg": "image/jpeg",       // JPEG image (common format for photos)
  ".jpeg": "image/jpeg",      // JPEG image (same as .jpg)
  ".png": "image/png",        // PNG image (supports transparency)
  ".gif": "image/gif",        // GIF image (supports animation)
  ".webp": "image/webp",      // WebP image (modern image format for the web)
  ".bmp": "image/bmp",        // BMP image (Bitmap, often uncompressed)
  ".tiff": "image/tiff",      // TIFF image (high-quality image format)
  ".tif": "image/tiff",       // TIFF image (same as .tiff)
  ".svg": "image/svg+xml",    // SVG image (Scalable Vector Graphics)
};
