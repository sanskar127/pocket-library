export interface VideoInterface {
  id: string;
  name: string;
  size: number;
  duration: number;
  modifiedAt: Date;
  type: string;
  url: string;
  thumbnail: string;
}

export interface DirectoryInterface {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface ScanVideosInterface {
  (filepath: string, extension: string): Promise<VideoInterface | null>
}

export type responseType = VideoInterface | DirectoryInterface

export interface requestBodyInterface {
  dir?: string;
  limit: number;
}
