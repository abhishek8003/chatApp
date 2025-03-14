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
        updateChats: (state, action) => {
            state = [...state, action.payload];
            return state;
        },
        changeStatus: (state, action) => {
            return state.map((message) => {
                return (message.senderId === action.payload.senderId &&
                    message.receiverId === action.payload.receiverId &&
                    message.createdAt === action.payload.createdAt)
                    ? { ...message, status: action.payload.status }
                    : message
            }
            );
        },
        changeStatusOfAll: (state, action) => {
            return state.map((message) =>{
                
                console.log("message.senderId:",message.senderId);
                console.log("message.receiverId:",message.receiverId);
                console.log("message.isGroupChat:",message.isGroupChat);
                
                return (message.senderId === action.payload.senderId &&
                    message.receiverId === action.payload.receiverId &&
                    message.isGroupChat === action.payload.isGroupChat)
                    ? { ...message, status: action.payload.status }
                    : message
                }
            );
        }
    }
});
export default chatsSlice.reducer;
export const { setChats, updateChats, changeStatus, changeStatusOfAll } = chatsSlice.actions;