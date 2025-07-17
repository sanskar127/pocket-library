import express, { Express, Request, Response } from 'express';
import fs from 'fs';
import cors from 'cors';

import { videosDir, cacheDir } from "./constants"
import { scanDirectory, scanVideos } from './services';
import path from 'path';

const app: Express = express();
const port: number = 3000;
app.use(cors());

// Create cache dir if missing
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
}

app.get('/api/videos/{*splat}', async (request: Request, response: Response) => {
    const splat = (request.params.splat as unknown as string[])

    // Scanning Directory
    try {
        const data = splat ? await scanDirectory(path.join(videosDir, splat.join('/'))) : await scanDirectory(videosDir)
        response.json(data)
    } catch (error: unknown) {
        console.error(error)
    }
})

app.get('/api/videos', async (_, response: Response) => {
    // Scanning Directory
    try {
        const data = await scanDirectory(videosDir)
        response.json(data)
    } catch (error: unknown) {
        console.error(error)
    }
})

// static routes
app.use('/', express.static(__dirname))
app.use('/thumbnails', express.static(cacheDir))
app.use('/videos', express.static(videosDir))

app.listen(port, () => console.log("Server is running at: http://localhost:3000"))