import { createApi } from "@reduxjs/toolkit/query/react"
import { getBaseQuery as baseQuery } from "@/features/baseQuery"

export const mediaApi = createApi({
    reducerPath: 'media-api',
    baseQuery,
    endpoints: (builder) => ({
        getMedia: builder.mutation({
            query: ({ pathname, offset, limit }: { pathname: string, offset: number, limit: number }) => ({
                url: '/media',
                method: 'POST',
                body: { pathname, offset, limit }
            })
        })
    })
})

export const { useGetMediaMutation } = mediaApi
