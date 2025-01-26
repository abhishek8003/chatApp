import { createSlice } from "@reduxjs/toolkit";
const initialState = true;
const checkingAuthSlice = createSlice({
    name: "checkingAuth",
    initialState: initialState,
    reducers: {
        setCheckingAuth: (state, action) => {
            state = action.payload;
            return state;
        }
    }
});
export default checkingAuthSlice.reducer;
export const { setCheckingAuth } = checkingAuthSlice.actions;