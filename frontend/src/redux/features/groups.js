import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
const groupSlice = createSlice({
    name: "groups",
    initialState: initialState,
    reducers: {
        intializeGroups:(state,action)=>{
            state = action.payload;
            return state;
        },
        setGroups: (state, action) => {
            state = action.payload;
            return state;
        },
        addGroup(state,action){
            state=[...state,action.payload];
            return state;
        }
    }
});
export default groupSlice.reducer;
export const { setGroups,addGroup,intializeGroups } = groupSlice.actions;