import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const messageImagePreviewUrlSlice = createSlice({
  name: "messageImagePreviewUrl",
  initialState: initialState,
  reducers: {
    setmessageImagePreviewUrl: (state, action) => {
      return action.payload;
    }
  }
});

export default messageImagePreviewUrlSlice.reducer;
export const { setmessageImagePreviewUrl } = messageImagePreviewUrlSlice.actions;
