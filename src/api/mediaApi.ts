import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const mediaApi = createApi({
    reducerPath: 'media-api',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000/api'}),
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
