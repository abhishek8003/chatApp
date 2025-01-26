import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
const onlineUsersSlice = createSlice({
    name: "onlineUsers",
    initialState,
    reducers: {
        setOnlineUsers: (state, action) => {
            state = action.payload;
            return action.payload;
        },
    },
});
export default onlineUsersSlice.reducer;
export const { setOnlineUsers } = onlineUsersSlice.actions;
