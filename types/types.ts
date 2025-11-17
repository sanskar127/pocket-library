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
  thumbnail?: string;
}

export interface ImageInterface {
  id: string;
  name: string;
  size: number;
  modifiedAt: Date;
  type: string;
  url: string;
}

export interface DirectoryInterface {
  id: string;
  name: string;
  type: 'directory';
  modifiedAt: Date;
  url: string;
}

export interface thumbnailBodyInterface {
    media: {
        url: string
        duration: number
    }
}

export type ItemType = VideoInterface | DirectoryInterface | ImageInterface

type DeviceType = "mobile" | "tablet" | "laptop" | "desktop"

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

export interface DeviceInterface {
  (): {
    device: DeviceType
    limit: number
  }
}

export type QueryKeyType = ['media', string]


export interface ResponseInterface {
  media: ItemType[]
  hasMore: boolean
}

export interface InfiniteResponseData {
  pages: ResponseInterface[]
  pageParams: unknown[]
}

export interface UseFetchMediaResult {
  data: InfiniteResponseData | undefined,
  hasNextPage: boolean,
  fetchNextPage: () => void,
  isPending: boolean,
  isError: boolean
}

export interface RenderItemInterface {
  (items: Record<string, any>): React.JSX.Element | null
}

export interface filterInterface {
  type: 'name' | 'date' | 'size' 
  order: 'ascending' | 'descending'
  sortDirectoryFirst: boolean
}

export type downloadType = 'direct' | 'stream' | 'default'

export interface DownloadState {
  progress: number; // 0 - 1
  status: 'idle' | 'ongoing' | 'paused' | 'finished' | 'failed';
  type: downloadType;
  error?: string | null;
  fileName?: string;
}

export interface DownloadManagerInterface {
    id: string
    filename: string
    size: number
    src: string
    path: string
    chunksize?: number
    onProgress?: (downloaded: number, total: number) => void
}