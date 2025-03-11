import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
const groupCurrentMembersSlice = createSlice({
    name: "groupCurrentMembers",
    initialState: initialState,
    reducers: {
        setgroupCurrentMembers: (state, action) => {
            return action.payload
            
        },
        addgroupCurrentMembers: (state, action) => {
            // return [
            //     ...state.filter(e => e._id !== action.payload._id), 
            //     action.payload
            // ];
            // return state._id===action.payload._id?state:[...state,action.payload]
            let alreadyExists=state.find(member => member._id === action.payload._id);
            return alreadyExists?state:[...state,action.payload]
        },
        removegroupCurrentMembers(state,action){
            console.log(action.payload);
            
            return state.filter((f)=>{
                if(f._id && (f?._id!=action.payload._id)){
                    return true
                }
                return false;
            })
        }  
    }
});
export default groupCurrentMembersSlice.reducer;
export const { setgroupCurrentMembers,addgroupCurrentMembers,removegroupCurrentMembers } = groupCurrentMembersSlice.actions;