import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
const groupPastMembersSlice = createSlice({
    name: "groupPastMembers",
    initialState: initialState,
    reducers: {
        setgroupPastMembers: (state, action) => {
            state = action.payload;
            return state;
        },
        addgroupPastMembers: (state, action) => {
            return [
                ...state.filter(e => e._id !== action.payload._id), 
                action.payload
            ];
        },
        removegroupPastMembers(state,action){
            return state.filter((f)=>{
                if(f._id!=action.payload._id){
                    return true
                }
                return false;
            })
        }  
    }
});
export default groupPastMembersSlice.reducer;
export const { setgroupPastMembers,addgroupPastMembers,removegroupPastMembers } = groupPastMembersSlice.actions;