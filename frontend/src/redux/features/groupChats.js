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
            if (!state.groupMessages) {
                state.groupMessages = []; // Ensure groupMessages exists
            }
            state.groupMessages.push(action.payload);
        },
        changeGroupMessageStatus: (state, action) => {
            return {
                ...state,
                groupMessages: state.groupMessages.map((m) => {
                    if (m.senderId._id == action.payload.senderId._id && m.receiverId == action.payload.receiverId && m.createdAt == action.payload.createdAt) {
                        console.log("GROUP MESSAGE TARGET FOUND!");
                        
                        return { ...m, status: action.payload.status }
                    }
                    return m;
                })
            }
        },
        removeMemberFromGroupChat: (state, action) => {
            if (state._id == action.payload.groupId) {
                return {
                    ...state,
                    groupMembers: state.groupMembers.filter(
                        (memberId) => memberId !== action.payload.memberId
                    ),
                    pastMembers: state.pastMembers.includes(action.payload.memberId) ? [...state.pastMembers] : [...state.pastMembers, action.payload.memberId] // Fix mutation
                };
            }
        },
        addMemberInGroupChat: (state, action) => {
            let alreadyMemberOfGroup = state.groupMembers.find(member => member._id === action.payload.member._id);
            return {
                ...state,
                groupMembers: alreadyMemberOfGroup ? state.groupMembers : [...state.groupMembers, action.payload.member],
                pastMembers: state.pastMembers.filter((e) => {
                    if (e != action.payload.member._id) {
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
export const { setGroupChat, updateGroupChat, removeMemberFromGroupChat, addMemberInGroupChat,changeGroupMessageStatus } = groupChatSlice.actions;
