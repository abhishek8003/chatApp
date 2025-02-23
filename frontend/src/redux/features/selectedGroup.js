import { createSlice } from "@reduxjs/toolkit";
const initialState=null;
const selectedGroupSlice=createSlice({
    name:"selectedGroup",
    initialState:initialState,
    reducers:{
        setSelectedGroup:(state,action)=>{
            state=action.payload;
            return action.payload;
        },
    }
});
export default selectedGroupSlice.reducer;
export const {setSelectedGroup}=selectedGroupSlice.actions;