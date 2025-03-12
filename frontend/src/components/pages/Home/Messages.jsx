import { Box, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CreateMessage from "./CreateMessage";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatbodySkeltion from "./skeletions/ChatbodySkeltion";
import { setGettingChats } from "../../../redux/features/gettingChats";
import { setChats } from "../../../redux/features/Chats";
import toast from "react-hot-toast";
import { socketContext } from "../../../SocketProvider";
import { backendContext } from "../../../BackendProvider";
import MessageImagePreview from "./MessageImagePreview";
import { setGroups } from "../../../redux/features/groups";
import GroupHeader from "./GroupHeader";
import GroupBody from "./GroupBody";
import { setGroupChat } from "../../../redux/features/groupChats";
import AccountInfo from "./AccountInfo";
import { setgroupCurrentMembers } from "../../../redux/features/groupCurrentMembers";
import { setgroupPastMembers } from "../../../redux/features/groupPastMembers";
import { setSelectedUser } from "../../../redux/features/selectedUser";
import { setSelectedGroup } from "../../../redux/features/selectedGroup";
function Messages() {
  let selectedUser = useSelector((store) => {
    return store.selectedUser;
  });
  let selectedGroup = useSelector((store) => {
    return store.selectedGroup;
  });
  let gettingChats = useSelector((store) => {
    return store.gettingChats;
  });
  let users = useSelector((store) => {
    return store.users;
  });
  let groups = useSelector((store) => {
    return store.groups;
  });
  let groupChat=useSelector((store)=>{
    return store.groupChat
  })
  let messageImagePreview = useSelector((store) => {
    return store.messageImagePreviewReducer;
  });
  let backendUrl = useContext(backendContext);
  let userAuth = useSelector((store) => {
    return store.userAuth;
  });
  let clientSocket = useContext(socketContext);
  useEffect(()=>{
    console.log("selectedGroup:", selectedGroup);
    console.log("groupChat:", groupChat);
    console.log("groups:", groups);
   
  },[selectedGroup,groupChat,groups,])
  useEffect(() => {
    if (selectedUser) {
      // dispatch(setChats([]));
      dispatch(setGettingChats(true));
      let fetchChats = async () => {
        try {
          let response = await fetch(
            `${backendUrl}/api/chats/${selectedUser._id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          let json = await response.json();
          if (response.status === 200) {
            console.log(json.allMessages);
            dispatch(setChats(json.allMessages));
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        } finally {
          dispatch(setGettingChats(false));
        }
      };
      fetchChats();
    }
  }, [selectedUser?._id,clientSocket]);
  useEffect(() => {
    if (selectedGroup) {
      // dispatch(setGroupChat(null));
      
      dispatch(setGettingChats(true));
      let fetchChats = async () => {
        try {
          let response = await fetch(
            `${backendUrl}/api/groups/group/${selectedGroup._id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          let json = await response.json();
          if (response.status === 200) {
            console.log(json.group);
            dispatch(setGroupChat(json.group));
            let pastMembers = json.group?.pastMembers || [];
            let pastMembersPopulated = users.filter((user) =>
              pastMembers.includes(user._id)
            );
            if (pastMembers.includes(userAuth._id)) {
              pastMembersPopulated.push(userAuth);
            }
            let currentMembers = json.group?.groupMembers.filter(
              (member) => !pastMembers.includes(member._id)
            );
            dispatch(setgroupPastMembers(pastMembersPopulated));
            dispatch(setgroupCurrentMembers(currentMembers));
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        } finally {
          dispatch(setGettingChats(false));
        }
      };
      fetchChats();
    }
  }, [selectedGroup?._id,clientSocket]);

  useEffect(() => {
    if (selectedUser) dispatch(setSelectedGroup(null));
  }, [selectedUser]);

  // Clear selectedUser when switching to group chats
  useEffect(() => {
    if (selectedGroup) dispatch(setSelectedUser(null));
  }, [selectedGroup]);

  let dispatch = useDispatch();

  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        minWidth: "80px",
        position: "relative",
      }}
    >
      {selectedUser ? (
        <>
          <ChatHeader></ChatHeader>
          {gettingChats ? (
            <ChatbodySkeltion></ChatbodySkeltion>
          ) : (
            <>
              <MessageImagePreview></MessageImagePreview>
              <ChatBody></ChatBody>
            </>
          )}
          <CreateMessage></CreateMessage>
        </>
      ) : (
        <></>
      )}
      {selectedGroup ? (
        <>
          <>
            <GroupHeader></GroupHeader>
            {gettingChats ? (
              <ChatbodySkeltion></ChatbodySkeltion>
            ) : (
              <>
                <MessageImagePreview></MessageImagePreview>
                <GroupBody></GroupBody>
              </>
            )}
            <CreateMessage></CreateMessage>
          </>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
}

export default Messages;
