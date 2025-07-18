import path from 'path';

export const videosDir: string = process.cwd();
// export const videosDir: string = 'public';
export const cacheDir: string = path.join(videosDir, '.cache');