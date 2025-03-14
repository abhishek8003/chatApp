import { createSlice } from "@reduxjs/toolkit";
const initialState = false;
const uploadingSlice = createSlice({
    name: "uploading",
    initialState: initialState,
    reducers: {
        uploadingToggle: (state,action) => {
            console.log("SETTING UPLOAD TO:",action.payload);
            
            return action.payload;
        }
    }
});
export default uploadingSlice.reducer;
export const { uploadingToggle } = uploadingSlice.actions;