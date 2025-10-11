import { ItemType, thumbnailBodyInterface } from "@/types/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface stateInterface {
    baseURL: string
    data: ItemType[]
}

const initialState: stateInterface = {
    baseURL: "",
    data: [],
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
        setThumbnails: (state, action: PayloadAction<thumbnailBodyInterface[]>) => {
            
        },
        resetData: (state) => {
            state.data = []
        }
    }
})

export const { setBaseURL, setData, resetData } = responseSlice.actions
export default responseSlice.reducer
