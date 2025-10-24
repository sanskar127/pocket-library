import { getChunk, mediaChecker, scanImages, scanVideos, transcodingHLS, validateLimit } from "../features/mediaFeatures";
import { DirectoryInterface, ImageExtension, requestBodyInterface, ItemType, VideoExtension } from "../types";
import { mediaDir, playbackDir, videoFormats, imageFormats, media, setMedia } from '../states';
import { Request, Response } from "express";
import { existsSync, readdirSync } from 'fs';
import { generateShortId } from "../utils";
import fs from 'fs/promises'
import path from 'path';

export const mediaController = async (request: Request, response: Response) => {
    const {
        pathname,
        limit,
        offset = 0,
        sorting = {
            type: 'date',
            order: 'descending',
            sortDirectoryFirst: true
        }
    }: requestBodyInterface = request.body;
    if (!validateLimit(limit)) return response.status(400).json({ error: 'Invalid limit' });

    const decodedDir = decodeURIComponent(pathname);    // Transforming Encoded URI to string with spaces
    const navigationPath = decodedDir ? path.join(mediaDir, decodedDir) : mediaDir;

    const safePath = path.normalize(navigationPath);
    if (!safePath.startsWith(path.normalize(mediaDir))) return response.status(403).json({ error: 'Forbidden directory access' });
    if (!existsSync(safePath)) return response.status(404).json({ error: "Directory not found" });

    try {
        if (!(pathname in media)) {
            const items = await fs.readdir(navigationPath);
            const entries = await Promise.all(items.map(async item => {
                try {
                    const filePath = path.join(navigationPath, item);
                    if (!await mediaChecker(filePath)) {
                        return null;  // Skip non-media files
                    }

                    const currentPath = path.join(navigationPath, item);
                    const stats = await fs.stat(currentPath);

                    if (stats.isDirectory()) {
                        const name = path.basename(currentPath);
                        return {
                            id: generateShortId(path.relative(mediaDir, navigationPath) + stats.mtimeMs),
                            name,
                            size: -1,
                            type: 'directory',
                            modifiedAt: stats.mtime,
                            url: name,
                        } as DirectoryInterface;
                    }

                    const extname = path.extname(item).toLowerCase() as VideoExtension;

                    if (videoFormats.hasOwnProperty(extname)) {
                        try {
                            return await scanVideos(currentPath, extname);
                        } catch (videoError) {
                            console.error(`Error scanning video at ${currentPath}:`, videoError);
                            return { error: "Failed to process video" }; // Fallback return
                        }
                    }

                    if (imageFormats.hasOwnProperty(extname)) {
                        try {
                            return await scanImages(currentPath, extname as ImageExtension);
                        } catch (imageError) {
                            console.error(`Error scanning image at ${currentPath}:`, imageError);
                            return { error: "Failed to process image" }; // Fallback return
                        }
                    }

                    return null;  // No match for video or image formats
                } catch (error) {
                    console.error(`Error processing file ${item}:`, error);
                    return { error: "Failed to process file" }; // Fallback return
                }
            })).then(entries => entries.filter(item => item !== null)) as ItemType[];

            setMedia({ [pathname]: entries })
        }

        // Sorting logic for media
        setMedia({
            [pathname]: media[pathname].sort((a, b) => {
                // First, check if sortDirectoryFirst is set
                if (sorting.sortDirectoryFirst) {
                    // Directories first, files later
                    if (a.type === 'directory' && b.type !== 'directory') return -1; // a is a directory, b is a file
                    if (a.type !== 'directory' && b.type === 'directory') return 1;  // b is a directory, a is a file
                } else {
                    // If sortDirectoryFirst is false, we want files first (default)
                    if (a.type === 'directory' && b.type !== 'directory') return 1; // a is a directory, b is a file
                    if (a.type !== 'directory' && b.type === 'directory') return -1; // b is a directory, a is a file
                }

                // Now apply sorting based on the requested type (name, date, size)
                const compare = (field: keyof ItemType) => {
                    const valA = a[field];
                    const valB = b[field];
                    if (sorting.order === 'ascending') {
                        return valA < valB ? -1 : valA > valB ? 1 : 0;
                    } else {
                        return valA > valB ? -1 : valA < valB ? 1 : 0;
                    }
                };

                switch (sorting.type) {
                    case 'name':
                        return compare('name');
                    case 'date':
                        return compare('modifiedAt');
                    case 'size':
                        return compare('size');
                    default:
                        return 0;
                }
            })
        });

        const { data, hasMore } = await getChunk(pathname, limit, offset);
        response.status(200).json({ data, hasMore });
    } catch (error) {
        console.error(`Error scanning directory ${navigationPath}:`, error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}

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
