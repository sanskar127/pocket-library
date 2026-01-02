import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
// import { filterInterface } from "@/types/types"

export const mediaApi = createApi({
    reducerPath: 'media-api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: builder => ({
        getMedia: builder.query({
            query: params => ({
                url: '/media',
                params
            })
        }),
        getSelectedMedia: builder.query({
            query: ({ id, params }) => ({
                url: `/media/${id}`,
                params
            })
        }),
        resetMedia: builder.mutation({
            query: params => ({
                url: '/media/reset',
                method: 'DELETE',
                params
            })
        })
    })
})

export const { useGetMediaQuery, useGetSelectedMediaQuery, useResetMediaMutation } = mediaApi
