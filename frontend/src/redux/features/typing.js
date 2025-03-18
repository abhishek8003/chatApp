import { createSlice } from "@reduxjs/toolkit";
const initialState = false;
const typingSlice = createSlice({
    name: "typing",
    initialState: initialState,
    reducers: {
        setTyping: (state,action) => {
            return action.payload;
        }
    }
});
export default typingSlice.reducer;
export const { setTyping } = typingSlice.actions;