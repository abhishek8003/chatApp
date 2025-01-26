import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action) => {
        state=action.payload;
      return action.payload; 
    },
  },
});

export default socketSlice.reducer;
export const { setSocket } = socketSlice.actions;