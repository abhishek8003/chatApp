import { createSlice } from "@reduxjs/toolkit";
const initialState = 0;
const retrySlice = createSlice({
    name: "retry",
    initialState: initialState,
    reducers: {
        increaseRetry: (state) => {
            return state++;
        }
    }
});
export default retrySlice.reducer;
export const { increaseRetry } = retrySlice.actions;