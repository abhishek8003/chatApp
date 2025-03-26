import { createSlice } from "@reduxjs/toolkit";
const initialState=null;
const selectedChatSlice=createSlice({
    name:"selectedChat",
    initialState:initialState,
    reducers:{
        setSelectedChat:(state,action)=>{
            state=action.payload;
            return state;
        },
        updateSelectedChat:(state,action)=>{
            // let newState=state;
            console.log(action.payload);
            
        },
    }
});
export default selectedChatSlice.reducer;
export const {setSelectedChat,updateSelectedChat}=selectedChatSlice.actions;