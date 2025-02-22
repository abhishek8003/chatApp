import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: [],
  reducers: {

    addNotification: (state,action) => {
        return [...state,action.payload];
    },
    intializeNotification:(state,action)=>{
        return action.payload
    }
  },
});

export const { addNotification,intializeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
