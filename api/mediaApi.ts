import { createApi } from "@reduxjs/toolkit/query/react"
import { getBaseQuery as baseQuery } from "@/features/getBaseQuery"
import { thumbnailBodyInterface } from "@/types/types"

export const mediaApi = createApi({
    reducerPath: 'media-api',
    baseQuery,
    endpoints: (builder) => ({
        getMedia: builder.mutation({
            query: (pathname: string) => ({
                url: '/media',
                method: 'POST',
                body: { pathname }
            })
        }),
        getThumbnails: builder.mutation({
            query: (media: thumbnailBodyInterface[]) => ({
                url: '/thumbnail',
                method: 'POST',
                body: { media }
            })
        })
    })
})

export const { useGetMediaMutation, useGetThumbnailsMutation } = mediaApi
