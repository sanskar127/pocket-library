import { ItemType } from "@/types/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface stateInterface {
    baseURL: string
    data: ItemType[],
    isMore: boolean
    offset: number
    limit: number
}

const initialState: stateInterface = {
    baseURL: "",
    data: [],
    isMore: false,
    offset: 0,
    limit: 3
}

export const responseSlice = createSlice({
    name: "response",
    initialState,
    reducers: {
        setBaseURL: (state, action: PayloadAction<string>) => {
            state.baseURL = action.payload
        },
        setData: (state, action: PayloadAction<ItemType[]>) => {
            state.data = [...state.data, ...action.payload]
        },
        setIsMore: (state, action: PayloadAction<boolean>) => {
            state.isMore = action.payload
        },
        setLimit: (state, action:PayloadAction<number>) => {
            state.limit = action.payload
        },
        setOffset: (state, action: PayloadAction<number>) => {
            state.offset += action.payload
        }
    }
})

export const { setBaseURL } = responseSlice.actions
export default responseSlice.reducer