import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
const chatsSlice = createSlice({
    name: "chats",
    initialState: initialState,
    reducers: {
        setChats: (state, action) => {
            state = action.payload;
            return state;
        },
        updateChats(state,action){
            state=[...state,action.payload];
            return state;
        }
    }
});
export default chatsSlice.reducer;
export const { setChats,updateChats } = chatsSlice.actions;