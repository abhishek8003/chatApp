import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
const groupChatSlice = createSlice({
    name: "groupChat",
    initialState: initialState,
    reducers: {
        setGroupChat: (state, action) => {
            state = action.payload;
            return state;
        },
        updateGroupChat: (state, action) => {
            // Use Immer (built into Redux Toolkit) to "mutate" the state immutably
            state.groupMessages.push(action.payload); // Append the payload to the array
        }
    }
});
export default groupChatSlice.reducer;
export const { setGroupChat,updateGroupChat } = groupChatSlice.actions;