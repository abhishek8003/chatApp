import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

const gettingChatsSlice = createSlice({
  name: "gettingchats",
  initialState,
  reducers: {
    setGettingChats: (state, action) => {
        state=action.payload;
      return action.payload; 
    },
  },
});

export default gettingChatsSlice.reducer;
export const { setGettingChats } = gettingChatsSlice.actions;
