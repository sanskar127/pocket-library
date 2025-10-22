export interface VideoInterface {
  id: string;
  name: string;
  size: number;
  duration: number;
  width: number;
  height: number;
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
  type: 'directory';
  modifiedAt: Date;
  url: string;
}

export type ItemType = VideoInterface | DirectoryInterface | ImageInterface

export interface ScanVideosInterface {
  (filepath: string, extension: VideoExtension): Promise<VideoInterface | null>
}

export interface ScanImagesInterface {
  (filepath: string, extension: ImageExtension): Promise<ImageInterface | null>
}

type DeviceType = "mobile" | "tablet" | "laptop" | "desktop"

export interface requestBodyInterface {
  pathname: string;
  offset: number;
  limit: number
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
    pathname: string,
    limit: number,
    offset: number
  ): Promise<{
    data: ItemType[];
    hasMore: boolean;
  }>;
}

export interface TranscodeResult {
  promise: Promise<string>;
  cancel: () => void;
}

export interface GetInitialLength {
  (device: DeviceType): { initialLimit: number, limit: number }
}

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
}

export interface mediaInterface {
  [key: string]: ItemType[]
}