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
    editNotificationOfUser: (state, action) => {
      console.log("inredux editNotificationOfUser:",action.payload);
      return state.map((c) => {
        console.log("c.senderId:",c.senderId);
        console.log("c.recieverId:",c.recieverId);
        console.log("c.createdAt:",c.createdAt);
        if (c.senderId === action.payload.senderId &&
            c.isGroupChat === action.payload.isGroupChat &&
            c.recieverId === action.payload.recieverId &&
            c.createdAt === action.payload.createdAt) {
              console.log("we got the targetted");
              
            return { ...c, text: action.payload.text }; // Return the updated object
        }
        return c; // Return the unchanged object
    });
    },
    editNotificationOfGroup: (state, action) => {
      console.log("inredux editNotificationOfGRoup:",action.payload);
      return state.map((c) => {
        console.log("c.senderId._id:",c.senderId);
        console.log("c.receiverId:",c.receiverId);
        console.log("c.createdAt:",c.createdAt);
        if (c.senderId === action.payload.senderId &&
            c.isGroupChat === action.payload.isGroupChat &&
            c.recieverId === action.payload.recieverId &&
            c.createdAt === action.payload.createdAt) {
              console.log("we got the targetted Group notifaction");
            return { ...c, text: action.payload.text }; // Return the updated object
        }
        return c; // Return the unchanged object
    });
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

export const { addNotification, intializeNotification, editNotificationOfUser,editNotificationOfGroup,deleteNotification, deleteNotificationOfUser, deleteNotificationOfGroup } = notificationSlice.actions;
export default notificationSlice.reducer;
