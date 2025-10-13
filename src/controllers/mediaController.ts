import { Request, Response } from "express";
import path from 'path';
import { existsSync, readdirSync } from 'fs';
import fs from 'fs/promises'

import { DirectoryInterface, ImageExtension, requestBodyInterface, thumbnailBodyInterface, VideoExtension } from "../types";
import { generateShortId } from "../utils";
import { imageFormats, videoFormats, videosDir } from "../constants";
import { getThumbnail, mediaChecker, scanImages, scanVideos } from "../features/mediaFeatures";

export const mediaController = async (request: Request, response: Response) => {
    const { pathname }: requestBodyInterface = request.body
    const decodedDir = decodeURIComponent(pathname);

    const navigationPath = decodedDir ? path.join(videosDir, decodedDir) : videosDir;
    const safePath = path.normalize(navigationPath);

    if (!safePath.startsWith(path.normalize(videosDir))) return response.status(403).json({ error: 'Forbidden directory access' });
    if (!existsSync(safePath)) return response.status(404).json({ error: "Directory not found" });

    const entries = (await Promise.all(
        readdirSync(navigationPath).map(async item => {
            const isValid = await mediaChecker(item);
            return isValid ? item : null;
        })
    )).filter(item => item !== null);

    const data = await Promise.all(entries.map(async (item) => {
        const currentPath = path.join(navigationPath, item);
        const stats = await fs.stat(currentPath);

        // If directory
        if (stats.isDirectory()) {
            const name = path.basename(currentPath);
            return {
                id: generateShortId(path.relative(videosDir, navigationPath) + stats.mtimeMs),
                name,
                type: 'directory',
                modifiedAt: stats.mtime,
                url: name,
            } as DirectoryInterface;
        }

        const extname = path.extname(item).toLowerCase();

        // If video
        if (videoFormats.hasOwnProperty(extname)) {
            try {
                return await scanVideos(currentPath, extname as VideoExtension);
            } catch (videoError) {
                console.error(`Error scanning video at ${currentPath}:`, videoError);
            }
        }

        // If image
        if (imageFormats.hasOwnProperty(extname)) {
            try {
                return await scanImages(currentPath, extname as ImageExtension);
            } catch (videoError) {
                console.error(`Error scanning video at ${currentPath}:`, videoError);
            }
        }
    }));

    response.status(200).json({ data })
}

export const thumbnailController = async (request: Request, response: Response) => {
    const { media }: thumbnailBodyInterface = request.body;

    // Process all the media in parallel
    try {
        const data: { name: string, thumbnail: string | null }[] = await Promise.all(
            media.map(async ({ url, duration }) => {
                const filepath = path.resolve(videosDir, url.replace('/videos/', ''));
                const name = path.basename(filepath, path.extname(filepath));
                try {
                    const thumbnail = await getThumbnail(filepath, duration);  // Get or generate thumbnail
                    return { name, thumbnail };
                } catch (error) {
                    console.error(`❌ Failed to generate thumbnail for ${url}:`, error);
                    return { name, thumbnail: null };  // Return null for failed thumbnail
                }
            })
        );

        response.status(200).json({ data });
    } catch (error) {
        console.error('❌ Error in thumbnailController:', error);
        response.status(500).json({ error: 'Failed to generate thumbnails' });
    }
};

export const streamingController = (request: Request, response: Response) => {

}