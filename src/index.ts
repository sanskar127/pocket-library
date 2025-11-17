import { selectedMediaController, mediaController, resetMediaController, streamingController } from './controllers/mediaController';
import { cacheDir, thumbnailsDir, mediaDir, cachingFile, setMedia } from './states';
import { generateQrCode, getLocalIPAddress, writeCacheData } from './utils';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import express, { Express, Response } from 'express';
import { mediaInterface } from './types';
import cors from 'cors';

const app: Express = express();
const port: number = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post('/api/media', mediaController);
app.post('/api/media/:id', selectedMediaController);
app.delete('/api/media/reset', resetMediaController);
app.post('/api/playback', streamingController);

app.get('/owner', (_, response: Response) => response.json({
    message: "Backend service for 'Pocket Media Library,' originally created and maintained by Sanskar (a.k.a. 5agmi), since July 2025."
}));

// Static file serving
app.use('/', express.static(__dirname));
app.use('/media', express.static(mediaDir));
app.use('/thumbnails', express.static(thumbnailsDir));

app.listen(port, async () => {
    // Create cache dir if missing
    if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });

    const address = getLocalIPAddress();
    const url: string = `http://${address}:${port}`;

    try {
        if (existsSync(cachingFile)) {
            const data = readFileSync(cachingFile, 'utf8');
            const jsonData: mediaInterface = JSON.parse(data);
            setMedia(jsonData);
        }

        const qr = await generateQrCode(url);
        console.log(
            "Pocket Media Library File server is Active!\n" +
            "1. Either you can scan qr code from your mobile device \n" +
            qr +
            "\n2. You can directly enter the host URL \n" +
            `\nLocal: http://localhost:${port}\n`
        );

        if (address) console.log(`Host: ${url}`);
    } catch (qrError) {
        console.error('Error generating QR code:', qrError);
        process.exit(1);
    }
});
