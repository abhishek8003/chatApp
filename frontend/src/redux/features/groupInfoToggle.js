import { createSlice } from "@reduxjs/toolkit";

const groupInfoToggleSlice = createSlice({
  name: "groupInfoToggle",
  initialState: false,
  reducers: {
    setGroupInfoToggle: (state) => {
      console.log("toogle fired");
        return !state;
    },
  },
});

export const { setGroupInfoToggle } =groupInfoToggleSlice.actions;
export default groupInfoToggleSlice.reducer;
