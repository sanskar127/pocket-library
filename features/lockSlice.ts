import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExternalPathString, RelativePathString } from "expo-router";

interface initialStateInterface {
  prevRoute: ExternalPathString | RelativePathString | "/";
  isEnable: boolean;
  isAvailable: boolean;
  isLocked: boolean;
}

const initialState: initialStateInterface = {
  prevRoute: "/",
  isEnable: false,
  isAvailable: false,
  isLocked: true,
};

// AsyncThunk to fetch `isEnable` value from AsyncStorage
export const setIsEnable = createAsyncThunk<boolean, void>(
  'lock/isEnable',
  async () => {
    try {
      const token = await AsyncStorage.getItem('isEnable');
      return token === 'true';  // Return boolean from AsyncStorage value
    } catch (error) {
      console.error('Error loading token from AsyncStorage:', error);
      return false;  // Default value if an error occurs
    }
  }
);

const lockSlice = createSlice({
  name: 'lock',
  initialState,
  reducers: {
    setPrevRoute: (state, action: PayloadAction<ExternalPathString | RelativePathString>) => {
      state.prevRoute = action.payload;
    },
    // Direct setter for isEnable and isLocked
    setIsEnableDirect: (state, action: PayloadAction<boolean>) => {
      state.isEnable = action.payload;
    },
    setIsAvailable: (state, action: PayloadAction<boolean>) => {
      state.isAvailable = action.payload;
    },
    setIsLocked: (state, action: PayloadAction<boolean>) => {
      state.isLocked = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setIsEnable.fulfilled, (state, action) => {
        state.isEnable = action.payload;
      })
      .addCase(setIsEnable.rejected, (state, action) => {
        console.error('Error fetching isEnable:', action.error.message);
        state.isEnable = false; // Default value on error
      })
  },
});

export const { setPrevRoute, setIsEnableDirect, setIsAvailable, setIsLocked } = lockSlice.actions;
export default lockSlice.reducer;
