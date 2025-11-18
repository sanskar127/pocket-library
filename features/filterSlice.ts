import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { filterInterface } from "@/types/types";

const FILTER_KEY = "filter";

const DEFAULT_FILTER: filterInterface = {
    type: "name",
    order: "ascending",
    sortDirectoryFirst: false
};

// 🔥 Thunk: load filter on app start
export const initFilter = createAsyncThunk(
    "filter/initFilter",
    async () => {
        try {
            const stored = await AsyncStorage.getItem(FILTER_KEY);

            if (stored) {
                return JSON.parse(stored) as filterInterface;
            } else {
                await AsyncStorage.setItem(FILTER_KEY, JSON.stringify(DEFAULT_FILTER));
                return DEFAULT_FILTER;
            }
        } catch (err) {
            console.error("Failed to load filter:", err);
            return DEFAULT_FILTER;
        }
    }
);

interface initialStateInterface {
    filter: filterInterface | null;
    loading: boolean;
}

const initialState: initialStateInterface = {
    filter: null,
    loading: true
};

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<filterInterface>) => {
            state.filter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(initFilter.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(initFilter.fulfilled, (state, action) => {
            state.filter = action.payload;
            state.loading = false;
        });
    }
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
