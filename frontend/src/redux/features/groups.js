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
        // removeMemberFromGroups: (state, action) => {
        //     return state.map((group) => {
        //         if (group._id === action.payload.groupId) {
        //             console.log("found thr imposter group");
        //             return {
        //                 ...state,
        //                 groupMembers: state.groupMembers.filter(
        //                     (memberId) => memberId !== action.payload.memberId
        //                 ),
        //                 pastMembers: state.pastMembers.includes(action.payload.memberId)
        //                     ? state.pastMembers
        //                     : [...state.pastMembers, action.payload.memberId],
        //             };
        //         }
        //         return group;
        //     });
        // },
        removeMemberFromGroups: (state, action) => {
            return state.map((group) => {
              if (group._id === action.payload.groupId) {
                return {
                  ...group, // <-- Fix: Spread group instead of state
                  groupMembers: group.groupMembers.filter(
                    id => id !== action.payload.memberId
                  ),
                  pastMembers: group.pastMembers.includes(action.payload.memberId)
                    ? group.pastMembers
                    : [...group.pastMembers, action.payload.memberId]
                };
              }
              return group;
            });
          },
        //  addMemberInGroups: (state, action) => {
        //     console.log("in target REDUZZZ:",state);
        //     return state.map((group) => {
        //         console.log("in target Gropu:",group);
        //         if (group._id === action.payload.groupId) {
        //             // alert("GROPS UPD")
        //             return {
        //                 ...group,
        //                 groupMembers: group.groupMembers.includes(action.payload.member._id)
        //                 ? group.groupMembers
        //                 : [...group.groupMembers, action.payload.member._id],
        //                 pastMembers: group.pastMembers.filter((e) => {
        //                     console.log("e:", e);
        //                     console.log("member._id", action.payload.member._id);
        //                     if (e != action.payload.member._id) {
        //                         return true;
        //                     }
        //                     return false;
        //                 }),
                       
        //             };
        //         }
        //         return group;
        //     });
        // }
        addMemberInGroups: (state, action) => {
            console.log("FUCKUED CALLED");
            
            
            return state.map((group) => {
                console.log("CALLED FOR GROUP IN GROUPS");
                console.log(group._id);
                console.log(action.payload.groupId);
              if (group._id === action.payload.groupId) {
                console.log("IMPORSTER");
                
                const memberId = action.payload.member._id;
                return {
                  ...group,
                  // Fix 1: Use group's own groupMembers (not state.groupMembers)
                  groupMembers: group.groupMembers.includes(memberId)
                    ? group.groupMembers // Keep existing if already present
                    : [...group.groupMembers, memberId],
                  // Fix 2: Simplify pastMembers filter
                  pastMembers: group.pastMembers.filter((id)=>{
                    if(id!==memberId){
                        console.log("value allowed");
                        return true;
                    }
                    console.log("value not allowed");
                    return false;
                  })
                };
              }
              return group;
            });
          }
    }
});

export default groupSlice.reducer;
export const { setGroups, addGroup, intializeGroups, removeMemberFromGroups, addMemberInGroups } = groupSlice.actions;
