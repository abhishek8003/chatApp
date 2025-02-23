import { createSlice } from "@reduxjs/toolkit";
const initialState = false;
const toggleGroupSlice = createSlice({
    name: "toggleGroup",
    initialState: initialState,
    reducers: {
        changeGroupBox: (state) => {
            return !state;
        }
    }
});
export default toggleGroupSlice.reducer;
export const { changeGroupBox } = toggleGroupSlice.actions;