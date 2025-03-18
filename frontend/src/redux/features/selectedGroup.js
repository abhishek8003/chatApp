import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const selectedGroupSlice = createSlice({
  name: "selectedGroup",
  initialState,
  reducers: {
    setSelectedGroup: (state, action) => {
      return action.payload; // Correct way to update state
    },
    addNewMessageInSelectedGroup: (state, action) => {
      console.log("ADDING TO SELECTED GROUP");
      
      if (!state.groupMessages) {
          state.groupMessages = []; // Ensure groupMessages exists
      }
      state.groupMessages.push(action.payload);
  },
    removeMemberFromSelectedGroup: (state, action) => {
      console.log("selected group updated!");
      if (state && state._id === action.payload.groupId) {
        return {
          ...state,
          groupMembers: state.groupMembers.filter(
            (memberId) => memberId !== action.payload.memberId
          ),
          pastMembers: state.pastMembers.includes(action.payload.memberId)
            ? state.pastMembers
            : [...state.pastMembers, action.payload.memberId],
        };
      }
      return state; // No changes if groupId doesn't match
    }
    ,
    // addMemberInSelectedGroup: (state, action) => {
    //     if (state?.groupMembers && state?.pastMembers) {
    //         return {
    //             ...state,
    //             groupMembers: [...state.groupMembers, action.payload.member._id],
    //             pastMembers: state.pastMembers.filter((e) => {
    //                 console.log("e:", e);
    //                 console.log("member._id", action.payload.member._id);
    //                 if (e != action.payload.member._id) {
    //                     return true;
    //                 }
    //                 return false;
    //             }),

    //         };
    //     }
    //     else {
    //         return state;
    //     }
    // },
    addMemberInSelectedGroup: (state, action) => {
      if (state?.groupMembers && state?.pastMembers) {
        const memberId = action.payload.member._id;

        return {
          ...state,
          // Prevent duplicate group members
          groupMembers: state.groupMembers.includes(memberId)
            ? state.groupMembers
            : [...state.groupMembers, memberId],
          // Simplified pastMembers filter
          pastMembers: state.pastMembers.filter(id => id !== memberId),
        };
      }
      return state;
    }

  }
});

export default selectedGroupSlice.reducer;
export const { setSelectedGroup,addNewMessageInSelectedGroup, removeMemberFromSelectedGroup, addMemberInSelectedGroup } = selectedGroupSlice.actions;
