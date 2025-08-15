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

type DeviceType = "mobile" | "tablet" | "laptop" | "desktop"

export interface requestBodyInterface {
  pathname: string;
  limit: number;
  offset: number;
}


export interface ChunkInterface {
  (
    limit: number,
    offset: number
  ): {
    chunk: string[]
    hasMore: boolean
  }
}


export interface GetInitialLength {
  (device: DeviceType): { initialLimit: number, limit: number }
}