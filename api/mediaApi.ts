import { createApi } from "@reduxjs/toolkit/query/react"
import { getBaseQuery as baseQuery } from "@/features/baseQuery"
import { filterInterface } from "@/types/types"

export const mediaApi = createApi({
    reducerPath: 'media-api',
    baseQuery,
    endpoints: (builder) => ({
        getMedia: builder.mutation({
            query: ({ pathname, offset, limit, sorting }: { pathname: string, offset: number, limit: number, sorting: filterInterface }) => ({
                url: '/media',
                method: 'POST',
                body: { pathname, offset, limit, sorting }
            })
        }),
        getSelectedMedia: builder.mutation({
            query: ({ id, pathname }: { id: string, pathname: string }) => ({
                url: `/media/${id}`,
                method: 'POST',
                body: { pathname }
            })
        }),
        resetMedia: builder.mutation({
            query: () => ({
                url: '/media/reset',
                method: 'DELETE'
            })
        })
    })
})

export const { useGetMediaMutation, useGetSelectedMediaMutation, useResetMediaMutation } = mediaApi
