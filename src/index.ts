import express, { Express, Request, Response } from 'express';
import fs from 'fs';
import cors from 'cors';

import { videosDir, cacheDir } from "./constants";
import { scanDirectory } from './services';
import path from 'path';
import { getLocalIPAddress } from './utils';

const app: Express = express();
const port: number = 3000;
app.use(cors());

// Create cache dir if missing
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
}

app.get('/api/videos', async (request: Request, response: Response) => {
    const { limit } = request.query as { limit: string }
    const limitNumber = parseInt(limit, 10);

    // Ensure the limit is a valid number
    if (isNaN(limitNumber) || limitNumber <= 0) {
        return response.status(400).json({ error: 'Invalid limit' });
    }

    // Scanning Directory
    try {
        const data = await scanDirectory(videosDir, limitNumber)
        response.json(data)
    } catch (error: unknown) {
        console.error(error)
    }
})

app.get('/api/videos/{*splat}', async (request: Request, response: Response) => {
    const splat = (request.params.splat as unknown as string[])
    const { limit } = request.query as { limit: string }
    const limitNumber = parseInt(limit, 10);

    // Ensure the limit is a valid number
    if (isNaN(limitNumber) || limitNumber <= 0) {
        return response.status(400).json({ error: 'Invalid limit' });
    }

    // Scanning Directory
    try {
        const data = await scanDirectory(path.join(videosDir, splat.join('/')), limitNumber)
        response.json(data)
    } catch (error: unknown) {
        console.error(error)
    }
})

// static routes
app.use('/', express.static(__dirname))
app.use('/thumbnails', express.static(cacheDir))
app.use('/videos', express.static(videosDir))

app.listen(port, () => console.log(`Server is running at: http://${getLocalIPAddress()}:${port}`))