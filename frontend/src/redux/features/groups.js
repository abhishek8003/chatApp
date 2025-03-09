import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const groupSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {
        intializeGroups: (state, action) => {
            return action.payload; // Correct way to replace state
        },
        setGroups: (state, action) => {
            return action.payload; // Correct way to replace state
        },
        addGroup: (state, action) => {
            state.push(action.payload); // Correct way to add a new group
        },
        removeMemberFromGroups: (state, action) => {
            return state.map((group) => {
                if (group._id === action.payload.groupId) {
                    return {
                        ...group,
                        groupMembers: group.groupMembers.filter(
                            (memberId) => memberId !== action.payload.memberId
                        ),
                        pastMembers: [...group.pastMembers, action.payload.memberId] // Fix mutation
                    };
                }
                return group;
            });
        }
        , addMemberInGroups: (state, action) => {
            console.log("in target REDUZZZ:",state);
            return state.map((group) => {
                console.log("in target Gropu:",group);
                if (group._id === action.payload.groupId) {
                    alert("GROPS UPD")
                    return {
                        ...group,
                        groupMembers: [...group.groupMembers, action.payload.member._id],
                        pastMembers: group.pastMembers.filter((e) => {
                            if (e != action.payload.member. _id) {
                                return e;
                            }
                        }),
                       
                    };
                }
                return group;
            });
        }
    }
});

export default groupSlice.reducer;
export const { setGroups, addGroup, intializeGroups, removeMemberFromGroups, addMemberInGroups } = groupSlice.actions;
