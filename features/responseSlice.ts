import { ItemType } from "@/types/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface stateInterface {
    baseURL: string
    data: ItemType[],
    hasMore: boolean
}

const initialState: stateInterface = {
    baseURL: "",
    data: [],
    hasMore: false
}

export const responseSlice = createSlice({
    name: "response",
    initialState,
    reducers: {
        setBaseURL: (state, action: PayloadAction<string>) => {
            state.baseURL = action.payload
        },
        setData: (state, action: PayloadAction<{ media: ItemType[], hasMore: boolean }>) => {
            state.data = [...state.data, ...action.payload.media]
            state.hasMore = action.payload.hasMore
        },
        setHasMore: (state, action: PayloadAction<boolean>) => {
            state.hasMore = action.payload
        },
        resetData: (state) => {
            state.data = []
            state.hasMore = false
        }
    }
})

export const { setBaseURL, setData, setHasMore, resetData } = responseSlice.actions
export default responseSlice.reducer