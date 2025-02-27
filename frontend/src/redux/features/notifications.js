import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: [],
  reducers: {

    addNotification: (state,action) => {
        return [...state,action.payload];
    },
    intializeNotification:(state,action)=>{
        return [...action.payload]
    },
    deleteNotificationOfUser:(state, action)=>{
      return state.filter(
        (e) =>
          e.senderId !== action.payload._id
      );
    },
    deleteNotificationOfGroup:(state, action)=>{
      return state.filter(
        (e) =>
          e.recieverId !== action.payload._id
      );
    },
    
    deleteNotification: (state, action) => {
      return state.filter(
        (e) =>
          e.senderId !== action.payload.senderId ||
          e.recieverId !== action.payload.recieverId ||
          e.isGroupChat !== action.payload.isGroupChat
      );
    }
    
  },
});

export const { addNotification,intializeNotification,deleteNotification ,deleteNotificationOfUser,deleteNotificationOfGroup} = notificationSlice.actions;
export default notificationSlice.reducer;
