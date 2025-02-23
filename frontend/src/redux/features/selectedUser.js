import { createSlice } from "@reduxjs/toolkit";
const initialState=null;
const selectedUserSlice=createSlice({
    name:"selectedUser",
    initialState:initialState,
    reducers:{
        setSelectedUser:(state,action)=>{
            state=action.payload;
            return state;
        },
        updateSelectedUser:(state,action)=>{
            // let newState=state;
            console.log(action.payload);
            return action.payload;
        }
    }
});
export default selectedUserSlice.reducer;
export const {setSelectedUser,updateSelectedUser}=selectedUserSlice.actions;