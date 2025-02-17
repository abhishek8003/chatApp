import { createSlice } from "@reduxjs/toolkit";

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState: [],
  reducers: {
    setOnlineUsers: (state, action) => {
    //   console.log("Action payload:", action.payload); // Debugging
      return action.payload; // Ensure it's directly setting the new array
    },
  },
});

export const { setOnlineUsers } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
