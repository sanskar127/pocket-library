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

export interface ImageInterface {
  id: string;
  name: string;
  size: number;
  modifiedAt: Date;
  type: string;
  url: string;
  thumbnail: string;
}

export interface DirectoryInterface {
  id: string;
  name: string;
  type: string;
  modifiedAt: Date;
  url: string;
}

export interface ScanVideosInterface {
  (filepath: string, extension: VideoExtension): Promise<VideoInterface | null>
}

export interface ScanImagesInterface {
  (filepath: string, extension: ImageExtension): Promise<ImageInterface | null>
}

export type responseType = VideoInterface | DirectoryInterface

type DeviceType = "mobile" | "tablet" | "laptop" | "desktop"

export interface requestBodyInterface {
  pathname: string;
  limit: number;
  offset: number;
}

export type VideoExtension =
  | ".mp4"
  | ".mov"
  | ".avi"
  | ".mkv"
  | ".wmv"
  | ".flv"
  | ".f4v"
  | ".webm"
  | ".mpeg"
  | ".mpg";

export type ImageExtension =
  | ".jpg"
  | ".jpeg"
  | ".png"
  | ".gif"
  | ".webp"
  | ".bmp"
  | ".tiff"
  | ".tif"
  | ".svg";

export interface ChunkInterface {
  (
    limit: number,
    offset: number
  ): {
    chunk: string[]
    hasMore: boolean
  }
}


export interface TranscodeResult {
  promise: Promise<string>;
  cancel: () => void;
}

export interface GetInitialLength {
  (device: DeviceType): { initialLimit: number, limit: number }
}