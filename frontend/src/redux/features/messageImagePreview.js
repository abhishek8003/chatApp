import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const messageImagePreviewSlice = createSlice({
  name: "messageImagePreview",
  initialState: initialState,
  reducers: {
    messageImagePreviewToggle: (state) => {
      return !state;
    }
  }
});

export default messageImagePreviewSlice.reducer;
export const { messageImagePreviewToggle } = messageImagePreviewSlice.actions;
