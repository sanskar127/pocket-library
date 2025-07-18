import fs from 'fs/promises';
import path from 'path';
import { videosDir } from "./constants";
import { generateShortId, getDuration, getThumbnail } from "./utils";
import type { DirectoryInterface, ResultDataType, scanDirectoryInterface, ScanVideosInterface } from './types';

// Variable to store the index of the last fetched file
let lastFetchedIndex = 0;

// Retrieve Videos from current Directory
export const scanVideos: ScanVideosInterface = async (filepath, extension) => {
  try {
    const relativeFilePath = path.relative(videosDir, filepath).replace(/\\/g, '/');
    const stats = await fs.stat(filepath);
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

export const scanDirectory: scanDirectoryInterface = async (dir, limit) => {
  const data: ResultDataType[] = [];

  try {
    const items = await fs.readdir(dir);
    let chunk: string[] = [];

    // Calculate the chunk to slice
    if (lastFetchedIndex >= items.length) {
      const index = Math.max(0, items.length - (limit - (lastFetchedIndex - items.length)));
      chunk = items.slice(index);
    } else {
      chunk = items.slice(lastFetchedIndex, lastFetchedIndex + limit);
    }

    // Iterate through chunk items
    for (const item of chunk) {
      const currentPath = path.join(dir, item);
      const stats = await fs.stat(currentPath);

      // Check if the item is a directory and process accordingly
      try {
        if (stats.isDirectory() && path.basename(currentPath) !== '.cache' && await mediaChecker(currentPath)) {
          const relativeFilePath = path.relative(videosDir, currentPath).replace(/\\/g, '/');
          data.push({
            id: generateShortId(path.relative(videosDir, dir) + stats.mtimeMs),
            name: path.basename(currentPath),
            type: 'directory',
            url: relativeFilePath,
          } as DirectoryInterface);
        }
      } catch (mediaError) {
        console.error(`Error checking media at ${currentPath}:`, mediaError);
      }

      // Check if the item is a video and process
      const extname = path.extname(item).toLowerCase();
      if (extname === '.mp4') {
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

    // Update the last fetched index after processing the chunk
    lastFetchedIndex += chunk.length;

  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }
  return data;
};
