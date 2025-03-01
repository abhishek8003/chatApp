import { createSlice } from "@reduxjs/toolkit";

const accountInfoToggleSlice = createSlice({
  name: "accountInfoToggle",
  initialState: false,
  reducers: {
    setaccountInfoToggle: (state) => {
      console.log("toggle fired");
        return !state;
    },
  },
});

export const { setaccountInfoToggle } = accountInfoToggleSlice.actions;
export default accountInfoToggleSlice.reducer;
