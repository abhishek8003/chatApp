import { createSlice } from "@reduxjs/toolkit";

const notificationToggleSlice = createSlice({
  name: "notificationToggle",
  initialState: false,
  reducers: {
    setNotificationToggle: (state) => {
        return !state;
    },
  },
});

export const { setNotificationToggle } = notificationToggleSlice.actions;
export default notificationToggleSlice.reducer;
