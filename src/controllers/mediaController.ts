import { fetchMediaEntries, getChunk, transcodingHLS, validateLimit } from "../features/mediaFeatures";
import { mediaDir, playbackDir, media, setMedia, cacheDir, cachingFile } from '../states';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'fs';
import { requestBodyInterface } from "../types";
import { Request, Response } from "express";
import path from 'path';
import { sortEntries, writeCacheData } from "../utils";

export const mediaController = async (request: Request, response: Response) => {
    const {
        pathname,
        limit,
        offset = 0,
        sorting = { type: 'date', order: 'descending', sortDirectoryFirst: true }
    }: requestBodyInterface = request.body;
    if (!validateLimit(limit)) return response.status(400).json({ error: 'Invalid limit' });

    const decodedDir = decodeURIComponent(pathname ?? '/');    // Transforming Encoded URI to string with spaces
    const navigationPath = decodedDir ? path.join(mediaDir, decodedDir) : mediaDir;

    const safePath = path.normalize(navigationPath);
    if (!safePath.startsWith(path.normalize(mediaDir))) return response.status(403).json({ error: 'Forbidden directory access' });
    if (!existsSync(safePath)) return response.status(404).json({ error: "Directory not found" });

    try {
        // Create cache dir if missing
        if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true })

        if (!media[decodedDir]) {
            const entries = await fetchMediaEntries(navigationPath);
            setMedia({ [decodedDir]: entries });
            writeCacheData();   // cache to disk
            sortEntries(decodedDir, sorting);   // sorting ALWAYS after setMedia()
        } else {
            // Handle Sorting entries from media state
            sortEntries(decodedDir, sorting)
            if (!existsSync(cachingFile)) writeCacheData();   // cache to disk
        }

        const { data, hasMore } = await getChunk(decodedDir, limit, offset);
        response.status(200).json({ data, hasMore });
    } catch (error) {
        console.error(`Error scanning directory ${navigationPath}:`, error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}

export const selectedMediaController = async (request: Request, response: Response) => {
    try {
        // Destructure id and pathname from the request body
        const { pathname }: { pathname: string } = request.body;
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

export const resetMediaController = (req: Request, res: Response) => {
    try {
        const option = req.query.option as 'metadata' | 'everything' | undefined;

        // Validate query parameter
        if (!option || (option !== 'metadata' && option !== 'everything')) {
            return res.status(400).json({ message: 'Invalid option. Must be "metadata" or "everything".' });
        }

        // Clear media state
        setMedia({});

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
