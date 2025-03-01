import { createSlice } from "@reduxjs/toolkit";
const accountDetailViewSlice=createSlice({
    name:"accountDetailView",
    initialState:"overview",
    reducers:{
        setaccountDetailView:(state,action)=>{
            console.log("setting view to",action.payload);
            return action.payload
        }
    }
});
export default accountDetailViewSlice.reducer;
export const {setaccountDetailView} =accountDetailViewSlice.actions;