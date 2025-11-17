import { filterInterface } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: filterInterface = {
    type: 'date',
    order: 'descending',
    sortDirectoryFirst: true
}

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<filterInterface>) => {
            state.type = action.payload.type;
            state.order = action.payload.order;
            state.sortDirectoryFirst = action.payload.sortDirectoryFirst;
        }
    }
})

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
