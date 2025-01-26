import { createSlice } from "@reduxjs/toolkit";
const initialState=[];
const usersSlice=createSlice({
    name:"users",
    initialState:initialState,
    reducers:{
        setUsers:(state,action)=>{
            state=action.payload;
            return state;
        }
    }
});
export default usersSlice.reducer;
export const {setUsers}=usersSlice.actions;