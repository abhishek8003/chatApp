import { createSlice } from "@reduxjs/toolkit";

const addGroupMemberToggleSlice = createSlice({
  name: "addGroupMemberToggle",
  initialState: false,
  reducers: {
    setaddGroupMemberToggle: (state) => {
      console.log("add group member toggle fired");
        return !state;
    },
  },
});

export const { setaddGroupMemberToggle } = addGroupMemberToggleSlice.actions;
export default addGroupMemberToggleSlice.reducer;
