import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const friendsSlice = createSlice({
    name: "friends",
    initialState,
    reducers: {
        addFriends: (state, action) => {
            console.log("Adding friend"); 
            state=[...state,...action.payload]
            return state;
        },
        addNewFriend: (state, action) => {
            console.log("Adding one friend"); 
            state=[...state,action.payload]
            return state;
           
        },
        intializeFriends:(state,action)=>{
            console.log("init friend"); 
            state=[...action.payload]
            return state;
        }
    },
});

export default friendsSlice.reducer;
export const { addFriends,intializeFriends,addNewFriend } = friendsSlice.actions;
