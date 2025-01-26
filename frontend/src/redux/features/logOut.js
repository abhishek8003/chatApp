import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const loggingOutSlice = createSlice({
  name: "loggingOut",
  initialState: initialState,
  reducers: {
    loggingOutToggle: (state) => {
      return !state;
    }
  }
});

export default loggingOutSlice.reducer;
export const { loggingOutToggle } = loggingOutSlice.actions;
