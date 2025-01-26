import { createSlice } from "@reduxjs/toolkit";
const initialState=false;
const sideNavSlice=createSlice({
    name:"sideNav",
    initialState:initialState,
    reducers:{
        sideNavToggle:(state)=>{
            return !state
        }
    }
});
export default sideNavSlice.reducer;
export const {sideNavToggle}=sideNavSlice.actions;