
export interface VideoInterface {
  id: string;
  name: string;
  size: number;
  duration: number;
  modifiedAt: Date;
  type?: string;
  url: string;
  thumbnail: string;
}

export interface RecursiveDirectoryInterface {
  name: string;
  directories: RecursiveDirectoryInterface[];
  files: VideoInterface[];
}

export interface DirectoryInterface {
  name: string;
  type: string;
}

export interface ScanVideosInterface {
  (filepath: string, extension: string): Promise<VideoInterface | null>
}

export interface scanDirectoryInterface {
  (dir: string): Promise<(VideoInterface | DirectoryInterface)[]>
}