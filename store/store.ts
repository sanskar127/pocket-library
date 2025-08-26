import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { mediaApi } from "@/api/mediaApi"
import responseReducer from "@/features/responseSlice"

export const store = configureStore({
  reducer: {
    response: responseReducer,
    [mediaApi.reducerPath]: mediaApi.reducer
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware().concat(mediaApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)