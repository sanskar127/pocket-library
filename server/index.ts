import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors'
import ffmpeg from 'fluent-ffmpeg';

const app = express();
const port = 3000;
app.use(cors())

// Use the directory where the app is launched
const videosDir = process.cwd();
const cacheDir = path.join(videosDir, '.cache');

// Ensure the .cache folder exists
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Scan for all .mp4 files recursively
const getAllVideos = (dir: string): any[] => {
  const results: any[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      results.push(...getAllVideos(fullPath));
    } else if (item.toLowerCase().endsWith('.mp4')) {
      results.push({
        name: item,
        path: path.relative(videosDir, fullPath),
        size: stats.size,
        modified: stats.mtime,
      });
    }
  }

  return results;
};

// Generate thumbnail if it doesn't exist
const generateThumbnail = (videoFullPath: string, thumbnailFullPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoFullPath)
      .inputOptions(['-ss', '300']) // ✅ Seek 5 seconds into the video before grabbing frame
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .output(thumbnailFullPath)
      .outputOptions([
        '-vframes', '1',
        '-vf', 'scale=320:240',
        '-c:v', 'libwebp',
        '-quality', '80',
        '-preset', 'default',
      ])
      .run();
  });
};

// API to list videos
app.get('/api/videos', async (req, res) => {
  try {
    const videos = getAllVideos(videosDir);

    for (const video of videos) {
      const safeName = video.path.replace(/[\/\\]/g, '_').replace('.mp4', '.webp');
      const thumbPath = path.join(cacheDir, safeName);

      if (!fs.existsSync(thumbPath)) {
        const videoFullPath = path.join(videosDir, video.path);
        try {
          await generateThumbnail(videoFullPath, thumbPath);
          console.log(`Thumbnail created: ${safeName}`);
        } catch (err) {
          console.error(`Failed to generate thumbnail for ${video.path}`);
        }
      }

      video.thumbnailUrl = `/thumbnails/${safeName}`;
      video.videoUrl = `/videos/${video.path}`;
    }

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to scan videos' });
  }
});

// Serve thumbnails and videos
app.use('/thumbnails', express.static(cacheDir));
app.use('/videos', express.static(videosDir));

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`📁 Serving from directory: ${videosDir}`);
});
