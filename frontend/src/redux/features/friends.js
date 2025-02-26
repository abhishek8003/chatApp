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
        updateFriends: (state, action) => {
            console.log("updating friends.......");
            
            return state.map((user) => {
                if (user._id === action.payload._id) {
                    return {
                        ...user,
                        profilePic: {
                            ...user.profilePic,
                            cloud_url: action.payload.profilePic.cloud_url,
                        },
                    };
                }
                return user;
            });
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
export const { addFriends,intializeFriends,addNewFriend,updateFriends } = friendsSlice.actions;
