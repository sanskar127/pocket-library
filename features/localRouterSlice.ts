import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ImageInterface, VideoInterface } from "@/types/types"

interface LocalRouterState {
  history: string[],
  selectedMediaStack: (VideoInterface | ImageInterface)[]
}

const initialState: LocalRouterState = {
  history: [],
  selectedMediaStack: []
}

const localRouterSlice = createSlice({
  name: 'localRouter',
  initialState,
  reducers: {
    addRouteToHistory: (state, { payload }: PayloadAction<string>) => {
      state.history.push(payload)
    },
    removeLastRoute: (state) => {
      state.history.pop()
    },
    pushSelectedMedia: (state, action: PayloadAction<VideoInterface | ImageInterface>) => {
      state.selectedMediaStack.push(action.payload)
    },
    popSelectedMedia: (state) => {
      state.selectedMediaStack.pop()
    }
  }
})

export const { addRouteToHistory, removeLastRoute, pushSelectedMedia, popSelectedMedia } = localRouterSlice.actions
export default localRouterSlice.reducer
