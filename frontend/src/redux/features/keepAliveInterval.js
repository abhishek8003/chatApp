import { createSlice } from "@reduxjs/toolkit";
const initialState = false;
const keepAliveIntervalSlice = createSlice({
    name: "keepAliveInterval",
    initialState: initialState,
    reducers: {
        setKeepAliveInterval: (state,action) => {
            console.log("SETTING keep Alive interval TO:",action.payload);
            
            return action.payload;
        }
    }
});
export default keepAliveIntervalSlice.reducer;
export const { setKeepAliveInterval } = keepAliveIntervalSlice.actions;