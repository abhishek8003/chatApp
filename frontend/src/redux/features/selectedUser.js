import { createSlice } from "@reduxjs/toolkit";
const initialState=null;
const selectedUserSlice=createSlice({
    name:"users",
    initialState:initialState,
    reducers:{
        setSelectedUser:(state,action)=>{
            state=action.payload;
            return state;
        }
    }
});
export default selectedUserSlice.reducer;
export const {setSelectedUser}=selectedUserSlice.actions;