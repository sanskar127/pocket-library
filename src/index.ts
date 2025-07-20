import { scanVideos, generateQrCode, generateShortId, getLocalIPAddress, mediaChecker } from './utils';
import { DirectoryInterface, requestBodyInterface, responseType } from './types';
import express, { Express, Request, response, Response } from 'express';
import { videosDir, cacheDir } from './constants';
import { existsSync, mkdirSync, readdir } from 'fs';
import fs from 'fs/promises';
import cors from 'cors';
import path from 'path';

const app: Express = express();
const port: number = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Utility to check and return the limit validation result
const validateLimit = (limit: number): boolean => !isNaN(limit) && limit > 0;

app.post('/api/videos', async (request: Request, response: Response) => {
    const { dir, limit, offset } = request.body as requestBodyInterface;

    const decodedDir = decodeURIComponent(dir as string)

    if (!validateLimit(limit)) {
        return response.status(400).json({ error: 'Invalid limit' });
    }

    const data: responseType[] = [];
    const navigationPath = decodedDir ? path.join(videosDir, decodedDir) : videosDir;

    try {
        // Use map with async mediaChecker and filter only valid items
        const items = (await Promise.all(
            (await fs.readdir(navigationPath)).map(async (item) => {
                // Check if item has media
                const isMedia = await mediaChecker(path.join(navigationPath, item));
                return isMedia ? item : null; // Keep item if it's valid media
            })
        )).filter((item) => item !== null); // Filter out null values

        const itemsLength = items.length;
        let chunk: string[] = [];

        if (offset < itemsLength) {
            chunk = items.slice(offset, offset + limit);
        } else if ((limit || offset) >= itemsLength) {
            chunk = items;
        } else {
            chunk = items.slice(offset - limit, itemsLength);
        }

        // Process directories and videos concurrently
        const promises = chunk.map(async (item) => {
            const currentPath = path.join(navigationPath, item);
            const stats = await fs.stat(currentPath);

            // Check if the item is a directory
            if (stats.isDirectory()) {
                const name = path.basename(currentPath)
                data.push({
                    id: generateShortId(path.relative(videosDir, navigationPath) + stats.mtimeMs),
                    name,
                    type: 'directory',
                    url: `/${name}`,
                } as DirectoryInterface);
            }

            // Check if the item is a video file (.mp4)
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
        });

        await Promise.all(promises);  // Wait for all items to be processed concurrently
        response.status(200).json(data);
    } catch (error) {
        console.error(`Error scanning directory ${navigationPath}:`, error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/owner', (_, response: Response) => response.json({ message: "Backend service for 'Pocket Media Library,' originally created and maintained by Sanskar (a.k.a. 5agmi), since July 2025." }))

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
