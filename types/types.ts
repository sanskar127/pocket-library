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
}

export interface DirectoryInterface {
  id: string;
  name: string;
  type: 'directory';
  modifiedAt: Date;
  url: string;
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

// export interface UseFetchMediaInterface {
//   (): UseInfiniteQueryResult<ResponseInterface, Error>
// }

export interface RenderItemInterface {
  (items: Record<string, any>): React.JSX.Element | null
}

export interface ItemListingPropsInterface {
  data: ItemType[]
  renderItem: RenderItemInterface
}
