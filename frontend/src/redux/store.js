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
import messageImagePreviewReducer from "./features/messageImagePreview";
import messageImagePreviewUrlReducer from "./features/messageImagePreviewUrl";
import friendsSliceReducer from "./features/friends";
import toggleDmReducer from "./features/toggleDm";
import notificationToggleReducer from "./features/notificationToggle"
import notificationReducer from "./features/notifications";
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
        onlineUsers:onlineUserReducer,
        messageImagePreview:messageImagePreviewReducer,
        messageImagePreviewUrl:messageImagePreviewUrlReducer,
        friends:friendsSliceReducer,
        toggleDm:toggleDmReducer,
        notificationToggle:notificationToggleReducer,
        notification:notificationReducer
    }
});
export default store;