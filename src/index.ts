import { scanVideos, generateQrCode, generateShortId, getLocalIPAddress, mediaChecker } from './utils';
import { DirectoryInterface, requestBodyInterface, responseType } from './types';
import express, { Express, Request, Response } from 'express';
import { videosDir, cacheDir } from "./constants";
import { existsSync, mkdirSync } from 'fs';
import fs from 'fs/promises';
import cors from 'cors';
import path from 'path';

const app: Express = express();
const port: number = 3000;
app.use(express.json())
app.use(cors());

app.post('/api/videos', async (request: Request, response: Response) => {
    const { dir, limit } = request.body as requestBodyInterface

    // Ensure the limit is a valid number
    if (isNaN(limit) || limit <= 0) {
        response.status(400).json({ error: 'Invalid limit' });
    }

    const data: responseType[] = [];
    const navigationPath = dir ? path.join(videosDir, dir) : videosDir;

    try {
        const items = await fs.readdir(navigationPath);

        // Iterate through chunk items
        for (const item of items) {
            const currentPath = path.join(navigationPath, item);
            const stats = await fs.stat(currentPath);

            // Check if the item is a directory and process accordingly
            try {
                if (stats.isDirectory() && path.basename(currentPath) !== '.cache' && await mediaChecker(currentPath)) {
                    const relativeFilePath = path.relative(videosDir, currentPath).replace(/\\/g, '/');
                    data.push({
                        id: generateShortId(path.relative(videosDir, navigationPath) + stats.mtimeMs),
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

        response.status(200).json(data)

    } catch (error) {
        console.error(`Error scanning directory ${navigationPath}:`, error);
    }
})

app.use('/', express.static(__dirname))
app.use('/videos', express.static(videosDir))
app.use('/thumbnails', express.static(cacheDir))

app.listen(port, async () => {
    // Create cache dir if missing
    if (!existsSync(cacheDir))
        mkdirSync(cacheDir, { recursive: true });

    const url: string = `http://${getLocalIPAddress()}:${port}`

    const qr = await generateQrCode(url)

    console.log(`Pocket Media Library File server is Active!\n1. Either you can scan qr code from your mobile device \n${qr} \nOR \nYou can directly enter the host URL \n\nHost: ${url}`)
})
