import path from 'path';

export const videosDir: string = process.cwd();
export const cacheDir: string = path.join(videosDir, '.cache');
export const playbackDir: string = path.join(cacheDir, 'playback');

export let isOffsetReset: boolean = false;
export let entries: string[] = [];
export let chunkedData: string[] = [];

export function setIsOffsetReset(offset: number) { isOffsetReset = offset === 0 ? true : false }

export function setEntries(data: string | null) {
    if (data === null) entries = [];
    else entries.push(data)
}
export function setChunkedData(data: string[] | null) {
    if (data === null) chunkedData = [];
    else chunkedData = [...chunkedData, ...data];
}
