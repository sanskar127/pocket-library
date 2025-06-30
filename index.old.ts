// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const mime = require('mime-types');
// const ffmpeg = require('fluent-ffmpeg');
// const app = express();
// const port = 3000;
// const videosDir = path.join(__dirname, 'videos'); // Your main video folder
// const cacheDir = path.join(videosDir, '.cache');  // Hidden cache folder to store thumbnails and metadata

// // Utility to get file metadata
// const getFileMetadata = (filePath) => {
//   const stats = fs.statSync(filePath);
//   return {
//     name: path.basename(filePath),
//     size: stats.size,  // Size in bytes
//     modified: stats.mtime,  // Last modified time
//     mimeType: mime.lookup(filePath),  // MIME type of the file
//   };
// };

// // Utility to generate a thumbnail using FFmpeg
// const generateThumbnail = (videoPath, thumbnailPath) => {
//   return new Promise((resolve, reject) => {
//     ffmpeg(videoPath)
//       .on('end', () => resolve(thumbnailPath))
//       .on('error', (err) => reject(err))
//       .screenshots({
//         timestamps: ['00:00:01.000'],  // Capture a thumbnail at 1 second
//         filename: path.basename(thumbnailPath),
//         folder: path.dirname(thumbnailPath),
//         size: '320x240',  // Thumbnail size
//         // Use .webp format instead of .jpg
//         pixelFormat: 'yuv420p',
//       });
//   });
// };

// // Ensure the cache directory exists
// const ensureCacheDirectory = () => {
//   if (!fs.existsSync(cacheDir)) {
//     fs.mkdirSync(cacheDir, { recursive: true });
//   }
// };

// // Function to get video metadata and create thumbnails if they don't exist
// const getVideoMetadata = (filePath) => {
//   const videoName = path.basename(filePath);
//   const cacheFilePath = path.join(cacheDir, `${videoName}.json`);
//   const thumbnailPath = path.join(cacheDir, `${videoName}.webp`);  // Store thumbnail as .webp

//   let metadata = null;

//   // If metadata already exists in cache, load it
//   if (fs.existsSync(cacheFilePath)) {
//     metadata = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
//   } else {
//     // Otherwise, create the metadata
//     metadata = getFileMetadata(filePath);
//     // Save metadata to cache
//     fs.writeFileSync(cacheFilePath, JSON.stringify(metadata));
//   }

//   // If thumbnail doesn't exist, generate it
//   if (!fs.existsSync(thumbnailPath)) {
//     generateThumbnail(filePath, thumbnailPath).catch((err) => {
//       console.error(`Error generating thumbnail for ${videoName}:`, err);
//     });
//   }

//   // Return metadata along with the thumbnail path
//   return { ...metadata, thumbnail: thumbnailPath };
// };

// // Recursive function to scan the directory for video files and subdirectories
// const getVideosInDirectory = (directory) => {
//   const files = fs.readdirSync(directory);
//   const videos = [];

//   files.forEach((file) => {
//     const fullPath = path.join(directory, file);
//     const stats = fs.statSync(fullPath);

//     if (stats.isDirectory()) {
//       // If it's a directory, recurse into it
//       videos.push({
//         directory: true,
//         name: file,
//         videos: getVideosInDirectory(fullPath),  // Recurse into subfolders
//       });
//     } else if (stats.isFile() && mime.lookup(fullPath)) {
//       // If it's a video file (based on MIME type)
//       const videoMetadata = getVideoMetadata(fullPath);
//       videos.push({
//         ...videoMetadata,
//         path: path.relative(videosDir, fullPath),  // Relative path to the video file
//       });
//     }
//   });

//   return videos;
// };

// // Endpoint to serve the list of videos and their metadata (including thumbnails)
// app.get('/api/videos', (req, res) => {
//   try {
//     const videos = getVideosInDirectory(videosDir);
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ error: 'Error scanning video directory' });
//   }
// });

// // Endpoint to serve video file
// app.get('/api/video/:filename', (req, res) => {
//   const filePath = path.join(videosDir, req.params.filename);
//   const mimeType = mime.lookup(filePath);

//   if (fs.existsSync(filePath)) {
//     res.setHeader('Content-Type', mimeType);
//     res.sendFile(filePath);
//   } else {
//     res.status(404).json({ error: 'Video not found' });
//   }
// });

// // Endpoint to serve video thumbnail (from cache)
// app.get('/api/thumbnail/:filename', (req, res) => {
//   const thumbnailPath = path.join(cacheDir, `${req.params.filename}.webp`);
//   if (fs.existsSync(thumbnailPath)) {
//     res.setHeader('Content-Type', 'image/webp');  // Set correct MIME type for .webp
//     res.sendFile(thumbnailPath);
//   } else {
//     res.status(404).json({ error: 'Thumbnail not found' });
//   }
// });

// // Start the Express server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
//   ensureCacheDirectory();  // Ensure cache directory is created when the server starts
// });