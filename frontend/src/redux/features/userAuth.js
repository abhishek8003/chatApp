import { createSlice } from "@reduxjs/toolkit";
const initialState = null;
const userAuthSlice = createSlice({
    name: "userAuth",
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            state = action.payload;
            return state;
        }
    }
});
export default userAuthSlice.reducer;
export const { setUser } = userAuthSlice.actions;