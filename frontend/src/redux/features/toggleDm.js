import { createSlice } from "@reduxjs/toolkit";
const initialState = false;
const toggleDmSlice = createSlice({
    name: "toggleDm",
    initialState: initialState,
    reducers: {
        changeDm: (state) => {
            return !state;
        }
    }
});
export default toggleDmSlice.reducer;
export const { changeDm } = toggleDmSlice.actions;