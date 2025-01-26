import { createSlice } from "@reduxjs/toolkit";
const initialState = null;
const chatsSlice = createSlice({
    name: "chats",
    initialState: initialState,
    reducers: {
        setChats: (state, action) => {
            state = action.payload;
            return state;
        }
    }
});
export default chatsSlice.reducer;
export const { setChats } = chatsSlice.actions;