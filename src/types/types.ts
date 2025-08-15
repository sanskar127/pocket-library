import type { UseInfiniteQueryResult } from "@tanstack/react-query"

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

export interface DirectoryInterface {
  id: string;
  name: string;
  type: string;
  url: string;
}

export type ItemType = VideoInterface | DirectoryInterface

type DeviceType = "mobile" | "tablet" | "laptop" | "desktop"

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

export interface UseFetchMediaInterface {
  (): UseInfiniteQueryResult<ResponseInterface, Error>
}
