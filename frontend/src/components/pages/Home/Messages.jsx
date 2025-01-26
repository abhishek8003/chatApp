import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CreateMessage from "./CreateMessage";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatbodySkeltion from "./skeletions/ChatbodySkeltion";
import { setGettingChats } from "../../../redux/features/gettingChats";
import { setChats } from "../../../redux/features/Chats";
import toast from "react-hot-toast";
function Messages() {
  let selectedUser = useSelector((store) => {
    return store.selectedUser;
  });
  let gettingChats=useSelector((store)=>{
    return store.gettingChats
  });
  
  useEffect(()=>{
    dispatch(setGettingChats(true))
    let fetchChats=async()=>{
      try {
        let response=await fetch(`http://localhost:5000/api/chats/${selectedUser._id}`,{
          method:"GET",
          credentials:"include"
        });
        let json=await response.json();
        if(response.status===200){
          console.log(json.allMessages);
          dispatch(setChats(json.allMessages))
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message)
      }
      finally{
        dispatch(setGettingChats(false));
      }
    }
    fetchChats();
  },[selectedUser])
  let dispatch=useDispatch();
  console.log(selectedUser);
  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        minWidth: "80px",
        position:"relative",
      }}
    >
      <ChatHeader></ChatHeader>
      {gettingChats?<ChatbodySkeltion></ChatbodySkeltion>:<ChatBody></ChatBody>}
      <CreateMessage></CreateMessage>
    </Box>
  );
}

export default Messages;
