import fs from 'fs/promises';
import path from 'path';
import { videosDir } from "./constants";
import { generateShortId, getDuration, getThumbnail } from "./utils";
import type { DirectoryInterface, scanDirectoryInterface, ScanVideosInterface, VideoInterface } from './types';

// Retrieve Videos from current Directory
export const scanVideos: ScanVideosInterface = async (filepath, extension) => {
  try {
    const relativeFilePath = path.relative(videosDir, filepath)
    const stats = await fs.stat(filepath);
    const duration = await getDuration(filepath);
    const thumbnail = await getThumbnail(relativeFilePath)

    return {
      id: generateShortId(path.relative(videosDir, filepath) + stats.mtimeMs),
      name: path.basename(filepath, extension),
      size: stats.size,
      modifiedAt: stats.mtime,
      duration,
      url: `/videos/${relativeFilePath}`,
      thumbnail
    };
  } catch (error) {
    console.error(`Error processing video ${filepath}:`, error);
    return null;  // Returning null for failed video processing
  }
};

// Recursively scan files and folders, returning a json tree response
// export const scanDirectories = async (dir: string): Promise<DirectoryInterface> => {
//   const data: DirectoryInterface = {
//     name: path.basename(dir),
//     directories: [],
//     files: []
//   };

//   // List all entries in current directory asynchronously
//   let items: string[] = [];
//   try {
//     items = await fs.promises.readdir(dir);
//   } catch (error) {
//     console.error(`Error reading directory ${dir}:`, error);
//     return data;  // Returning empty data on error
//   }

//   // Process directories and files concurrently
//   const directoryPromises: Promise<void>[] = [];
//   const filePromises: Promise<VideoInterface | null>[] = [];

//   for (const item of items) {
//     const currentPath: string = path.join(dir, item);
//     try {
//       const stats = await fs.promises.stat(currentPath);

//       if (stats.isDirectory() && path.basename(currentPath) !== '.cache') {
//         directoryPromises.push(
//           (async () => {
//             const subdirectory = await scanDirectories(currentPath);
//             data.directories.push(subdirectory);
//           })()
//         );
//       } else if (item.toLowerCase().endsWith('.mp4')) {
//         filePromises.push(scanVideos(currentPath, '.mp4'));
//       }
//     } catch (error) {
//       console.error(`Error processing item ${item}:`, error);
//     }
//   }

//   // Wait for all files and subdirectories to be processed
//   data.files = (await Promise.all(filePromises)).filter(Boolean) as VideoInterface[];

//   // Wait for all directories to be processed
//   await Promise.all(directoryPromises);

//   return data;
// };

async function mediaChecker(dir: string): Promise<boolean> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

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

export const scanDirectory: scanDirectoryInterface = async (dir) => {
  const data: (VideoInterface | DirectoryInterface)[] = [];

  try {
    const items = await fs.readdir(dir);

    for (const item of items) {
      const currentPath = path.join(dir, item);
      const stats = await fs.stat(currentPath);

      if (stats.isDirectory() && path.basename(currentPath) !== '.cache' && await mediaChecker(currentPath)) {
        data.push({
          name: path.basename(currentPath),
          type: 'directory',
        } as DirectoryInterface);
      } else if (item.toLowerCase().endsWith('.mp4')) {
        try {
          const video = await scanVideos(currentPath, '.mp4');
          if (video) {
            data.push(video);
          }
        } catch (videoError) {
          console.error(`Error scanning video at ${currentPath}:`, videoError);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }

  return data;
};