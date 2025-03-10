import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const selectedGroupSlice = createSlice({
    name: "selectedGroup",
    initialState,
    reducers: {
        setSelectedGroup: (state, action) => {
            return action.payload; // Correct way to update state
        },
        removeMemberFromSelectedGroup: (state, action) => {
            console.log("selected group updated!");

            if (!state) return state; // Ensure state is not null
            if (state._id == action.payload.groupId) {
                return {
                    ...state,
                    groupMembers: state.groupMembers.filter(
                        (memberId) => memberId !== action.payload.memberId
                    ),
                    
                    pastMembers: state.pastMembers.includes(action.payload.memberId) ? state.pastMembers : [...state.pastMembers, action.payload.memberId] 
                    // Fix mutation
                };
            }
        },
        addMemberInSelectedGroup: (state, action) => {
            if (state?.groupMembers && state?.pastMembers) {
                return {
                    ...state,
                    groupMembers: [...state.groupMembers, action.payload.member._id],
                    pastMembers: state.pastMembers.filter((e) => {
                        console.log("e:", e);
                        console.log("member._id", action.payload.member._id);


                        if (e != action.payload.member._id) {
                            return true;
                        }
                        return false;
                    }),

                };
            }
            else {
                return state;
            }
        }

    }
});

export default selectedGroupSlice.reducer;
export const { setSelectedGroup, removeMemberFromSelectedGroup, addMemberInSelectedGroup } = selectedGroupSlice.actions;
