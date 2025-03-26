import { createSlice } from "@reduxjs/toolkit";

const editMessageToggleSlice = createSlice({
  name: "editMessageToggle",
  initialState: false,
  reducers: {
    seteditMessageToggle: (state,action) => {
      console.log("toggle edit fired");
        return action.payload;
    },
  },
});

export const { seteditMessageToggle } = editMessageToggleSlice.actions;
export default editMessageToggleSlice.reducer;
