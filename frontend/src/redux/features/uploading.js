import { createSlice } from "@reduxjs/toolkit";
const initialState = false;
const uploadingSlice = createSlice({
    name: "uploading",
    initialState: initialState,
    reducers: {
        uploadingToggle: (state) => {
            return !state;
        }
    }
});
export default uploadingSlice.reducer;
export const { uploadingToggle } = uploadingSlice.actions;