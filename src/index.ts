import { scanVideos, generateQrCode, generateShortId, getLocalIPAddress, getChunk, validateLimit, setMediaFiles } from './utils';
import { videosDir, cacheDir, isOffsetReset, setIsOffsetReset, entries } from './states';
import { DirectoryInterface, requestBodyInterface, responseType } from './types';
import express, { Express, Request, Response } from 'express';
import { existsSync, mkdirSync } from 'fs';
import fs from 'fs/promises';
import cors from 'cors';
import path from 'path';

const app: Express = express();
const port: number = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post('/api/videos', async (request: Request, response: Response) => {
    const media: responseType[] = [];
    const { pathname, limit, offset = 0 }: requestBodyInterface = request.body;

    const decodedDir = decodeURIComponent(pathname);
    setIsOffsetReset(offset);

    const navigationPath = decodedDir ? path.join(videosDir, decodedDir) : videosDir;
    const safePath = path.normalize(navigationPath);

    if (!safePath.startsWith(path.normalize(videosDir))) return response.status(403).json({ error: 'Forbidden directory access' });
    if (!existsSync(safePath)) return response.status(404).json({ error: "Directory not found" });
    if (!validateLimit(limit)) return response.status(400).json({ error: 'Invalid limit' });

    try {
        // Use map with async mediaChecker and filter only valid items
        if (isOffsetReset) await setMediaFiles(navigationPath);

        const { chunk, hasMore } = getChunk(limit, offset);

        // Process directories and videos concurrently
        const results = await Promise.all(chunk.map(async (item) => {
            const currentPath = path.join(navigationPath, item);
            const stats = await fs.stat(currentPath);

            // If directory
            if (stats.isDirectory()) {
                const name = path.basename(currentPath);
                return {
                    id: generateShortId(path.relative(videosDir, navigationPath) + stats.mtimeMs),
                    name,
                    type: 'directory',
                    url: name,
                } as DirectoryInterface;
            }

            // If video
            const extname = path.extname(item).toLowerCase();
            if (extname === '.mp4') {
                try {
                    return await scanVideos(currentPath, '.mp4');
                } catch (videoError) {
                    console.error(`Error scanning video at ${currentPath}:`, videoError);
                }
            }

            return null; // Skip non-directories/non-mp4
        }));

        const filteredResults = results.filter((item): item is responseType => item !== null);
        media.push(...filteredResults);

        response.status(200).json({ media, hasMore });
    } catch (error) {
        console.error(`Error scanning directory ${navigationPath}:`, error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/owner', (_, response: Response) => response.json({
    message: "Backend service for 'Pocket Media Library,' originally created and maintained by Sanskar (a.k.a. 5agmi), since July 2025."
}))

// Static file serving
app.use('/', express.static(__dirname));
app.use('/videos', express.static(videosDir));
app.use('/thumbnails', express.static(cacheDir));

app.listen(port, async () => {
    // Create cache dir if missing
    if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });

    const address = getLocalIPAddress();
    const url: string = `http://${address}:${port}`;

    try {
        const qr = await generateQrCode(url);
        console.log(
            "Pocket Media Library File server is Active!\n" +
            "1. Either you can scan qr code from your mobile device \n" +
            qr +
            "\n2. You can directly enter the host URL \n" +
            `\nLocal: http://localhost:${port}\n`
        );

        if (address) console.log(`Host: ${url}`)
    } catch (qrError) {
        console.error('Error generating QR code:', qrError);
        process.exit(1)
    }
});
