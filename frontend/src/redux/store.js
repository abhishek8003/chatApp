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
import toggleGroupReducer from "./features/toggleGroup";
import notificationToggleReducer from "./features/notificationToggle"
import notificationReducer from "./features/notifications";
import groupReducer from "./features/groups";
import selectGroupReducer from "./features/selectedGroup"
import groupChatReducer from "./features/groupChats"
import accountInfoToggleReducer from "./features/accountInfoToggle"
import groupInfoToggleReducer from "./features/groupInfoToggle"
import accountDetailViewReducer from "./features/accountDetailView";
import groupDetailViewReducer from "./features/groupDetailView";
import groupCurrentMembersReducer from "./features/groupCurrentMembers";
import groupPastMembersReducer from "./features/groupPastMembers";
import addGroupMemberToggleReducer from "./features/addGroupMemberToggle";
import newGroupMembersReducer from "./features/newGroupMembers"
import retryReducer from "./features/retry";
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
        toggleGroup:toggleGroupReducer,
        notificationToggle:notificationToggleReducer,
        notification:notificationReducer,
        groups:groupReducer,
        groupChat:groupChatReducer,
        selectedGroup:selectGroupReducer,
        accountInfoToggle:accountInfoToggleReducer,
        groupInfoToggle:groupInfoToggleReducer,
        accountDetailView:accountDetailViewReducer,
        groupDetailView:groupDetailViewReducer,
        groupCurrentMembers:groupCurrentMembersReducer,
        groupPastMembers:groupPastMembersReducer,
        addGroupMemberToggle:addGroupMemberToggleReducer,
        newGroupMembers:newGroupMembersReducer,
        retry:retryReducer
    }
});
export default store;