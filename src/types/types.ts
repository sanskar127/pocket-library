import type { QueryFunctionContext } from "@tanstack/react-query"

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

type ItemType = VideoInterface | DirectoryInterface

export interface ResponseInterface {
  data: ItemType[]
  isMore: boolean
}

export type QueryKeyType = ['media', string, number]

export interface fetchInterface {
  (context: QueryFunctionContext<QueryKeyType>): Promise<ResponseInterface>
}
