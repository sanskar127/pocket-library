import { selectedMediaController, mediaController, resetMediaController, streamingController, downloadStreamController } from './controllers/mediaController';
import { thumbnailsDir, mediaDir, cachingFile, setMedia } from './states';
import { generateQrCode, getLocalIPAddress } from './utils';
import express, { Express, Response } from 'express';
import { existsSync, readFileSync } from 'fs';
import cors from 'cors';
import { ItemType } from './types';

const app: Express = express();
const port: number = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/api/media', mediaController);
app.get('/api/media/:id', selectedMediaController);
app.get('/api/download', downloadStreamController);
app.delete('/api/reset', resetMediaController);
app.get('/api/playback', streamingController);

app.get('/owner', (_, response: Response) => response.json({
    message: "Backend service for 'Pocket Media Library,' originally created and maintained by Sanskar (a.k.a. 5agmi), since July 2025."
}));

// Static file serving
app.use('/', express.static(__dirname));
app.use('/media', express.static(mediaDir));
app.use('/thumbnails', express.static(thumbnailsDir));

app.listen(port, async () => {
    const address = getLocalIPAddress();
    const url: string = `http://${address}:${port}`;

    try {
        if (existsSync(cachingFile)) {
            const data = readFileSync(cachingFile, 'utf8');
            const jsonData: Record<string, ItemType[]> = JSON.parse(data);
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
