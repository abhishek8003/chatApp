import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    groupMessages: [],
    groupMembers: [],
    pastMembers: []
};

const groupChatSlice = createSlice({
    name: "groupChat",
    initialState,
    reducers: {
        setGroupChat: (state, action) => {
            return action.payload; // Correct way to replace state
        },
        updateGroupChat: (state, action) => {
            state.groupMessages.push(action.payload); // Ensure state has groupMessages
        },
        removeMemberFromGroupChat: (state, action) => {
            return {
                ...state,
                groupMembers: state.groupMembers.filter(
                    (memberId) => memberId !== action.payload.memberId
                ),
                pastMembers: [...state.pastMembers, action.payload.memberId] // Fix mutation
            };
        },
        addMemberInGroupChat: (state, action) => {
            
            return {
                ...state,
                groupMembers:  [...state.groupMembers, action.payload.member],
                pastMembers: state.pastMembers.filter((e)=>{
                    if(e!=action.payload.member._id){
                        return true;
                    }
                    return false;
                }),
                // currentMembers: state.currentMembers.includes(memberId)
                //     ? state.currentMembers 
                //     : [...state.currentMembers, action.payload.member._id] 
            };
        }
    }
});

export default groupChatSlice.reducer;
export const { setGroupChat, updateGroupChat, removeMemberFromGroupChat,addMemberInGroupChat } = groupChatSlice.actions;
