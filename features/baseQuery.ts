import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/store/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    baseURL: "" as string,
}

export const getBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const state = api.getState() as RootState
    const userBaseUrl = state.baseurl.baseURL

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

export const responseSlice = createSlice({
    name: "baseurl",
    initialState,
    reducers: {
        setBaseURL: (state, action: PayloadAction<string>) => {
            state.baseURL = action.payload
        }
    }
})

export const { setBaseURL } = responseSlice.actions
export default responseSlice.reducer
