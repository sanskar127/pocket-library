import { ImageInterface, VideoInterface } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state interface
interface initialStateInterface {
    selectedMedia: VideoInterface | ImageInterface | null;  // Can be null initially
}

// Define the initial state
const initialState: initialStateInterface = {
    selectedMedia: null,  // No media selected initially
}

// Create the slice
const contentSlice = createSlice({
    initialState,
    name: 'content',
    reducers: {
        // Action to set the selected media (could be a video or an image)
        setSelectedMedia: (state, action: PayloadAction<VideoInterface | ImageInterface | null>) => {
            state.selectedMedia = action.payload;
        },
    }
});

// Export actions
export const { setSelectedMedia } = contentSlice.actions;

// Export reducer
export default contentSlice.reducer;
