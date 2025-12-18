import { fetchMediaEntries, getChunk, transcodingHLS, validateLimit } from "../features/mediaFeatures";
import { mediaDir, playbackDir, media, setMedia, cacheDir, cachingFile, mediaFormats } from '../states';
import { createReadStream, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'fs';
import { MediaExtension, requestQueryInterface, sortInterface } from "../types";
import { sortEntries, writeCacheData } from "../utils";
import { Request, Response } from "express";
import path from 'path';

export const mediaController = async (request: Request, response: Response) => {
    const {
        pathname = '/',
        limit = '7',
        offset = '0',
        type = 'date',
        order = 'descending',
        dirFirst = 'true'
    } = request.query as requestQueryInterface;

    // Convert to proper types for logic
    const numericLimit = parseInt(limit, 10);
    const numericOffset = parseInt(offset, 10);
    const isDirFirst = dirFirst === 'true';

    // Validate Limit
    if (!validateLimit(numericLimit)) return response.status(400).json({ error: 'Invalid limit' });

    const decodedDir = decodeURIComponent(pathname);
    const navigationPath = path.join(mediaDir, decodedDir);

    // Security: Path Traversal Protection
    const safePath = path.normalize(navigationPath);
    if (!safePath.startsWith(path.normalize(mediaDir))) {
        return response.status(403).json({ error: 'Forbidden directory access' });
    }
    
    if (!existsSync(safePath)) return response.status(404).json({ error: "Directory not found" });

    try {
        if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });

        // 3. Map query params to your sort interface
        const sorting: sortInterface = { 
            type: type as any, 
            order: order as any, 
            dirFirst: isDirFirst 
        };

        if (!media[decodedDir]) {
            const entries = await fetchMediaEntries(navigationPath);
            setMedia({ [decodedDir]: entries });
            writeCacheData();
            sortEntries(decodedDir, sorting); 
        } else {
            sortEntries(decodedDir, sorting);
            if (!existsSync(cachingFile)) writeCacheData();
        }

        // 4. Pass the converted numbers to getChunk
        const { data, hasMore } = await getChunk(decodedDir, numericLimit, numericOffset);
        response.status(200).json({ data, hasMore });

    } catch (error) {
        console.error(`Error scanning directory ${navigationPath}:`, error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}

export const selectedMediaController = async (request: Request, response: Response) => {
    try {
        // Destructure id and pathname from the request body
        const { pathname = '/' } = request.query as { pathname?: string };
        const { id } = request.params

        // Check if id and pathname are provided
        if (!id || pathname === undefined) {
            return response.status(400).json({ error: 'Both id and pathname are required' });
        }

        // Check if the pathname exists in the media object
        const selectedPath = media[pathname];
        if (!selectedPath) {
            return response.status(404).json({ error: `Pathname '${pathname}' not found` });
        }

        // Find the media item by id
        const data = selectedPath.find(item => item.id === id);
        if (!data) {
            return response.status(404).json({ error: `Media with id '${id}' not found in '${pathname}'` });
        }

        // Send the response with the found data
        return response.status(200).json({ data });
    } catch (error) {
        // General error handling
        console.error('Error in selectedMediaController:', error);
        return response.status(500).json({ error: 'Internal server error' });
    }
};

export const downloadStreamController = async (request: Request, response: Response) => {
    const { source } = request.query as { source: string }

    if (!existsSync(source)) {
        return response.status(404).send("File not found");
    }

    const stat = statSync(source);
    const filename = path.basename(source)
    const extension = path.extname(source) as MediaExtension
    const filetype = mediaFormats[extension]
    const fileSize = stat.size;
    const range = request.headers.range;

    if (!range) {
        response.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Type": filetype,
        });
        createReadStream(source).pipe(response);
        return;
    }

    const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
        response.status(416).header({
            "Content-Range": `bytes */${fileSize}`,
        });
        return response.end();
    }

    const chunkSize = end - start + 1;
    response.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": filetype,
    });

    createReadStream(source, { start, end }).pipe(response);
}

export const resetMediaController = (req: Request, res: Response) => {
    try {
        const option = req.query.option as 'metadata' | 'everything' | undefined;

        // Validate query parameter
        if (!option || (option !== 'metadata' && option !== 'everything')) {
            return res.status(400).json({ message: 'Invalid option. Must be "metadata" or "everything".' });
        }

        // Clear media state
        setMedia(null);

        // Delete cache depending on the option
        if (option === 'metadata') {
            rmSync(cachingFile, { force: true })
        } else {
            rmSync(cacheDir, { recursive: true, force: true });
        }

        res.status(200).json({ message: 'Cache data deleted successfully!' });
    } catch (error) {
        console.error('Error deleting media cache:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const streamingController = async (request: Request, response: Response) => {
    const { video }: { video: string } = request.body;

    try {
        const safeName = path.basename(video, path.extname(video));
        const videoPath = path.join(mediaDir, video);
        const playbackPath = path.join(playbackDir, safeName);
        const playlistPath = path.join(playbackPath, 'playlist.m3u8');
        const doneFile = path.join(playbackPath, '.done');
        const lockFile = path.join(playbackPath, '.lock');

        // Incomplete state if no .done or missing playlist
        const isIncomplete =
            !existsSync(doneFile) ||
            !existsSync(playlistPath) ||
            readdirSync(playbackPath).filter(f => f.endsWith('.ts')).length === 0;

        if (isIncomplete && !existsSync(lockFile)) {
            console.log('🔁 Resuming or starting transcoding...');
            await transcodingHLS(videoPath, playbackPath);
        }

        response.sendFile('playlist.m3u8', { root: playbackPath });
    } catch (err) {
        console.error('❌ Playback error:', err);
        response.status(500).send('Error preparing playback.');
    }
}
