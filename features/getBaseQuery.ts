import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/store/store'

export const getBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const state = api.getState() as RootState
    const userBaseUrl = state.response.baseURL

    if (!userBaseUrl) {
        return {
            error: { status: 400, data: 'Base URL not set by user' }
        }
    }

    const rawBaseQuery = fetchBaseQuery({
        baseUrl: (userBaseUrl + '/api'),
    })

    return rawBaseQuery(args, api, extraOptions)
}
