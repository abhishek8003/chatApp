import { createSlice } from "@reduxjs/toolkit";
const groupDetailViewSlice=createSlice({
    name:"groupDetailView",
    initialState:"overview",
    reducers:{
        setgroupDetailView:(state,action)=>{
            console.log("setting view to",action.payload);
            return action.payload
        }
    }
});
export default groupDetailViewSlice.reducer;
export const {setgroupDetailView} =groupDetailViewSlice.actions;