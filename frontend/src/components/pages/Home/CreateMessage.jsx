import { Box, Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollectionsIcon from "@mui/icons-material/Collections";
import SendIcon from "@mui/icons-material/Send";
import {
  changeStatus,
  updateChats,
} from "../../../redux/features/Chats";
import toast from "react-hot-toast";
import { socketContext } from "../../../SocketProvider";
import { backendContext } from "../../../BackendProvider";
import { setGroupChat } from "../../../redux/features/groupChats";
import { uploadingToggle } from "../../../redux/features/uploading";

function CreateMessage() {
  const selectedGroup = useSelector((store) => store.selectedGroup);
  const selectedUser = useSelector((store) => store.selectedUser);
  const backendUrl = useContext(backendContext);
  const clientSocket = useContext(socketContext);
  const chats = useSelector((store) => store.chats);
  const onlineUsers = useSelector((store) => store.onlineUsers);
  const uploading = useSelector((store) => store.uploading);
  const userAuth = useSelector((store) => store.userAuth);

  const inputFile = useRef();
  const dispatch = useDispatch();
  const formRef = useRef();

  const [preview, setPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSendingMessage, setSendingMessage] = useState(false);

  /** File Preview Handler */
  const handleFilePreview = () => {
    setTimeout(() => {
      if (inputFile.current?.files[0]) {
        setPreview(true);
        let fileObj = inputFile.current.files[0];
        let fileReader = new FileReader();
        fileReader.onloadend = (e) => setPreviewUrl(e.target.result);
        fileReader.readAsDataURL(fileObj);
      }
    }, 0);
  };

  /** Sending Message */
  const handleSendMessage = async (event) => {
    event.preventDefault();
    setSendingMessage(true);

    const time = new Date().toISOString();
    const text = formRef.current.newMessage.value;
    const imgTempUrl = previewUrl;
    let file = formRef.current.messageFile?.files[0];

    if (!text && !file) {
      setSendingMessage(false);
      return;
    }

    if (selectedUser) {
      // Optimized: Batch dispatch to minimize re-renders
      dispatch(
        updateChats({
          senderId: userAuth._id,
          receiverId: selectedUser._id,
          text,
          image: { local_url: "", cloud_url: imgTempUrl },
          createdAt: time,
          status: "pending",
          isGroupChat: false,
        })
      );

      requestIdleCallback(() => dispatch(uploadingToggle(true)));

      clientSocket?.emit("sendMessage", {
        senderId: userAuth._id,
        recieverId: selectedUser._id,
        message_text: text,
        message_image: imgTempUrl,
        createdAt: time,
      });

      let formData = new FormData();
      if (text) formData.append("messageText", text);
      if (file) formData.append("messageImage", file);
      formData.append("messageTime", time);

      setPreview(false);
      setMessageText("");
      inputFile.current.value = "";

      fetch(`${backendUrl}/api/chats/${selectedUser._id}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((response) => response.json())
        .then((json) => {
          const receiverStatus = onlineUsers.find(
            (u) => u._id === json.newMessage.receiverId
          );
          if (!receiverStatus) {
            dispatch(changeStatus(json.newMessage));
          }
          setSendingMessage(false);
          setPreviewUrl(null);
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.message);
          setSendingMessage(false);
        });
    }

    if (selectedGroup) {
      if (selectedGroup.pastMembers.includes(userAuth._id)) {
        toast.error("You are not a member of this group");
        setSendingMessage(false);
        return;
      }

      clientSocket?.emit("addGroupMessage", {
        selectedGroup: selectedGroup._id,
        messageBody: { messageText: text, messageImage: previewUrl, createdAt: new Date() },
      });

      let groupFormData = new FormData();
      if (text) groupFormData.append("messageText", text);
      if (file) groupFormData.append("messageImage", file);

      fetch(`${backendUrl}/api/groups/group/${selectedGroup._id}/message`, {
        method: "POST",
        credentials: "include",
        body: groupFormData,
      })
        .then((response) => response.json())
        .then((json) => {
          dispatch(setGroupChat(json.group));
          setMessageText("");
          inputFile.current.value = "";
          setSendingMessage(false);
          setPreview(false);
          setPreviewUrl(null);
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.message);
          setSendingMessage(false);
        });
    }
  };

  return (
    <>
      {preview && inputFile.current?.files[0] && (
        <div style={{ position: "absolute", bottom: "80px", left: "10px" }}>
          <img src={previewUrl} height="100px" width="100px" alt="Preview" />
          <i
            onClick={() => {
              inputFile.current.value = "";
              setPreview(false);
              setPreviewUrl(null);
            }}
            className="fa-solid fa-square-xmark"
            style={{
              position: "absolute",
              right: "-11px",
              top: "-11px",
              fontSize: "1.25rem",
              color: "red",
            }}
          ></i>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSendMessage}>
        <div
          style={{
            minHeight: "70px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Type a message..."
            autoComplete="off"
            value={messageText}
            name="newMessage"
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (!(messageText.length > 0 || preview) && e.key === "Enter") {
                e.preventDefault();
              }
            }}
            sx={{ flexGrow: "1" }}
          />

          <Box sx={{ "& svg": { height: "56px", margin: "0px 0.4rem", fontSize: "2.2rem" } }}>
            <label htmlFor="messageFile">
              <CollectionsIcon />
            </label>
            <input
              type="file"
              ref={inputFile}
              id="messageFile"
              name="messageFile"
              onChange={() => {
                handleFilePreview();
                document.querySelector('input[name="newMessage"]').focus();
              }}
              style={{ display: "none" }}
            />

            <Button
              type="submit"
              disabled={(messageText.length > 0 || preview ? false : true) || isSendingMessage}
            >
              <SendIcon />
            </Button>
          </Box>
        </div>
      </form>
    </>
  );
}

export default CreateMessage;
