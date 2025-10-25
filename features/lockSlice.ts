import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface initialStateInterface {
  isEnable: boolean;
  isAvailable: { compatibility: boolean, enrolled: boolean };
}

const initialState: initialStateInterface = {
  isEnable: false,
  isAvailable: { compatibility: false, enrolled: false },
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
    // Direct setter for isEnable and isLocked
    setIsEnableDirect: (state, action: PayloadAction<boolean>) => {
      state.isEnable = action.payload;
    },
    setIsAvailable: (state, action: PayloadAction<{ compatibility: boolean, enrolled: boolean }>) => {
      state.isAvailable = action.payload;
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

export const { setIsEnableDirect, setIsAvailable } = lockSlice.actions;
export default lockSlice.reducer;
