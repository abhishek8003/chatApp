import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./features/userAuth";
import   sideNavToggleReducer from "./features/sideNav";
import checkAuthReducer from "./features/checkingAuth"
import loggingOutReducer from "./features/logOut";
import usersReducer from "./features/users";
import chatsReducer from "./features/Chats";
import selectedUserReducer from "./features/selectedUser"
import gettingChatsReducer from "./features/gettingChats";
import onlineUserReducer from "./features/onlineUsers";

const store=configureStore({
    reducer:{
        userAuth:userAuthReducer,
        checkingAuth:checkAuthReducer,
        sideNav:sideNavToggleReducer,
        loggingOut:loggingOutReducer,
        users:usersReducer,
        selectedUser:selectedUserReducer,
        chats:chatsReducer,
        gettingChats:gettingChatsReducer,
        onlineUsers:onlineUserReducer
    }
});
export default store;