import express, { Express, Request, Response } from 'express';
import { existsSync, mkdirSync } from 'fs';
import cors from 'cors';
import { mediaController, streamingController, thumbnailController } from './controllers/mediaController';
import { cacheDir, videosDir } from './constants';
import { generateQrCode, getLocalIPAddress } from './utils';

const app: Express = express();
const port: number = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post('/api/media', mediaController)
app.post('/api/thumbnail', thumbnailController)
app.post('/api/playback', streamingController)

// app.post('/api/playback', async (request: Request, response: Response) => {
//     const { video }: { video: string } = request.body;

//     try {
//         const safeName = path.basename(video, path.extname(video));
//         const videoPath = path.join(videosDir, video);
//         const playbackPath = path.join(playbackDir, safeName);
//         const playlistPath = path.join(playbackPath, 'playlist.m3u8');
//         const doneFile = path.join(playbackPath, '.done');
//         const lockFile = path.join(playbackPath, '.lock');

//         // Incomplete state if no .done or missing playlist
//         const isIncomplete =
//             !existsSync(doneFile) ||
//             !existsSync(playlistPath) ||
//             readdirSync(playbackPath).filter(f => f.endsWith('.ts')).length === 0;

//         if (isIncomplete && !existsSync(lockFile)) {
//             console.log('🔁 Resuming or starting transcoding...');
//             await transcodingHLS(videoPath, playbackPath);
//         }

//         response.sendFile('playlist.m3u8', { root: playbackPath });
//     } catch (err) {
//         console.error('❌ Playback error:', err);
//         response.status(500).send('Error preparing playback.');
//     }
// });

app.get('/owner', (_, response: Response) => response.json({
    message: "Backend service for 'Pocket Media Library,' originally created and maintained by Sanskar (a.k.a. 5agmi), since July 2025."
}));

// Static file serving
app.use('/', express.static(__dirname));
app.use('/videos', express.static(videosDir));
app.use('/thumbnails', express.static(cacheDir));

app.listen(port, async () => {
    // Configure FFmpeg path
    // ffmpeg.setFfmpegPath(ffmpegPath as string);

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
