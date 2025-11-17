import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ImageInterface, VideoInterface } from "@/types/types"

interface LocalRouterState {
  history: string[],
  feed: VideoInterface | ImageInterface | null
}

const initialState: LocalRouterState = {
  history: [],
  feed: null
}

const localRouterSlice = createSlice({
  name: 'localRouter',
  initialState,
  reducers: {
    addRouteToHistory: (state, action: PayloadAction<string>) => {
      state.history.push(action.payload)
    },
    removeLastRoute: (state) => {
      state.history.pop()
    },
    setFeed: (state, action: PayloadAction<VideoInterface | ImageInterface>) => {
      state.feed = action.payload
    }
  }
})

export const { addRouteToHistory, removeLastRoute, setFeed } = localRouterSlice.actions
export default localRouterSlice.reducer
