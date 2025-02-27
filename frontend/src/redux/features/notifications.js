import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: [],
  reducers: {

    addNotification: (state, action) => {
      return [...state, action.payload];
    },
    intializeNotification: (state, action) => {
      return [...action.payload]
    },
  
    deleteNotificationOfUser: (state, action) => {
      console.log("inredux deleteNotificationOfUser:",action.payload);
    
      return state.filter(
        (e) => {
          console.log(e.senderId);
          console.log(action.payload._id);
          console.log(e.isGroupChat);
          if ((e.senderId == action.payload._id) && e.isGroupChat) {
            console.log("wil be deleted!");
            return true;
          }
          
        }
      );
    },
    deleteNotificationOfGroup: (state, action) => {
      console.log("inredux deleteNotificationOfGroup:",action.payload);
      
      return state.filter(
        (e) =>
          e.receiverId !== action.payload._id
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

export const { addNotification, intializeNotification, deleteNotification, deleteNotificationOfUser, deleteNotificationOfGroup } = notificationSlice.actions;
export default notificationSlice.reducer;
