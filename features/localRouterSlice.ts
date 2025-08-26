import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface LocalRouterState {
  history: string[]
}

const initialState: LocalRouterState = {
  history: []
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
  }
})

export const { addRouteToHistory, removeLastRoute } = localRouterSlice.actions
export default localRouterSlice.reducer
