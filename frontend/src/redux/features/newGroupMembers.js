import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const newGroupMembersSlice = createSlice({
  name: "newGroupMembers",
  initialState,
  reducers: {
    setnewGroupMembers: (state, action) => {
        state=action.payload;
      return action.payload; 
    },
    addnewGroupMembers:(state,action)=>{
        return [...state,action.payload];
    }
  },
});

export default newGroupMembersSlice.reducer;
export const { setnewGroupMembers,addnewGroupMembers } = newGroupMembersSlice.actions;