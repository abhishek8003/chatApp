import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
const usersSlice = createSlice({
    name: "users",
    initialState: initialState,
    reducers: {
        setUsers: (state, action) => {
            state = action.payload;
            return state;
        },
        addNewUser: (state, action) => {
            state = [...state, action.payload];
            return state;
        },
        updateOneUser: (state, action) => {
            return state.map((user) => {
                if (user._id === action.payload._id) {
                    return {
                        ...user,
                        profilePic: {
                            ...user.profilePic,
                            cloud_url: action.payload.profilePic.cloud_url,
                        },
                    };
                }
                return user;
            });
        },

    }
});
export default usersSlice.reducer;
export const { setUsers, addNewUser, updateOneUser } = usersSlice.actions;