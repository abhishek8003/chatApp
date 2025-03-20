import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            return action.payload; // Directly return the new state
        },
        updateUser: (state, action) => {
            if (!state) return state; // Prevent errors when state is null
            return {
                ...state,
                profilePic: action.payload.profilePic, // ✅ Correct syntax
            };
        }
    }
});

export default userAuthSlice.reducer;
export const { setUser, updateUser } = userAuthSlice.actions;
