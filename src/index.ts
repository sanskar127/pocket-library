import { scanVideos, generateQrCode, generateShortId, getLocalIPAddress, mediaChecker } from './utils';
import { DirectoryInterface, requestBodyInterface, responseType } from './types';
import express, { Express, Request, Response } from 'express';
import { videosDir, cacheDir } from './constants';
import { existsSync, mkdirSync } from 'fs';
import fs from 'fs/promises';
import cors from 'cors';
import path from 'path';

const app: Express = express();
const port: number = 3000;

app.use(express.json());
app.use(cors());

// Utility to check and return the limit validation result
const validateLimit = (limit: number): boolean => !isNaN(limit) && limit > 0;

app.post('/api/videos', async (request: Request, response: Response) => {
    const { dir, limit, offset } = request.body as requestBodyInterface;

    if (!validateLimit(limit)) {
        return response.status(400).json({ error: 'Invalid limit' });
    }

    const data: responseType[] = [];
    const navigationPath = dir ? path.join(videosDir, dir) : videosDir;

    try {
        const items = (await fs.readdir(navigationPath)).filter(item => item !== '.cache');

        const itemsLength = items.length
        let chunk: string[] = []

        if (offset < itemsLength)
            chunk = items.slice(offset, offset + limit);

        else if ((limit || offset) >= itemsLength)
            chunk = items

        else
            chunk = items.slice(offset - limit, itemsLength);

        // Process directories and videos concurrently
        const promises = chunk.map(async (item) => {
            const currentPath = path.join(navigationPath, item);
            const stats = await fs.stat(currentPath);
            const extname = path.extname(item).toLowerCase();

            // Check if the item is a directory
            if (stats.isDirectory() && await mediaChecker(currentPath)) {
                const relativeFilePath = path.relative(videosDir, currentPath).replace(/\\/g, '/');
                data.push({
                    id: generateShortId(path.relative(videosDir, navigationPath) + stats.mtimeMs),
                    name: path.basename(currentPath),
                    type: 'directory',
                    url: relativeFilePath,
                } as DirectoryInterface);
            }

            // Check if the item is a video file (.mp4)
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
        });

        await Promise.all(promises);  // Wait for all items to be processed concurrently
        response.status(200).json(data);
    } catch (error) {
        console.error(`Error scanning directory ${navigationPath}:`, error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});

// Static file serving
app.use('/', express.static(__dirname));
app.use('/videos', express.static(videosDir));
app.use('/thumbnails', express.static(cacheDir));

app.listen(port, async () => {
    // Create cache dir if missing
    if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });

    const url: string = `http://${getLocalIPAddress()}:${port}`;

    try {
        const qr = await generateQrCode(url);
        console.log(`Pocket Media Library File server is Active!\n1. Either you can scan qr code from your mobile device \n${qr} \n2. You can directly enter the host URL \n\nLocal: http://localhost:${port}\nHost: ${url}`);
    } catch (qrError) {
        console.error('Error generating QR code:', qrError);
        process.exit(1)
    }
});
