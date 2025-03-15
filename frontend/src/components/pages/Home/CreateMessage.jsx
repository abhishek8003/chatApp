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
  const backendUrl = useContext(backendContext);
  const selectedUser = useSelector((store) => store.selectedUser);
  const inputFile = useRef();
  const clientSocket = useContext(socketContext);
  const chats = useSelector((store) => store.chats);
  const onlineUsers = useSelector((store) => store.onlineUsers);
  const [preview, setPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSendingMessage, setSendingMessage] = useState(false);
  const uploading = useSelector((store) => store.uploading);
  const userAuth = useSelector((store) => store.userAuth);
  const dispatch = useDispatch();

  const form = useRef();

  const handleFilePreview = () => {
    setPreview(true);
    if (inputFile && inputFile.current.files[0]) {
      const fileObj = inputFile.current.files[0];
      const fileReader = new FileReader();
      fileReader.addEventListener("loadend", (e) => {
        setPreviewUrl(e.target.result);
      });
      fileReader.readAsDataURL(fileObj);
    }
  };

  const handleSendMessage = async (myForm) => {
    setSendingMessage(true);
    const time = new Date().toISOString();
    const text = myForm.newMessage.value;
    const imgTempUrl = previewUrl;

    if (selectedUser) {
      dispatch(
        updateChats({
          senderId: userAuth._id,
          receiverId: selectedUser._id,
          text,
          image: {
            local_url: "",
            cloud_url: imgTempUrl,
          },
          createdAt: time,
          status: "pending",
          isGroupChat: false,
        })
      );
      dispatch(uploadingToggle(true));

      // Emit the message immediately via socket
      setTimeout(() => {
        clientSocket?.emit("sendMessage", {
          senderId: userAuth._id,
          recieverId: selectedUser._id,
          message_text: text,
          message_image: imgTempUrl,
          createdAt: time,
        });
      }, 0);

      const file = myForm.messageFile && myForm.messageFile.files[0];
      if (!text && !file) return;

      const formData = new FormData();
      if (text) formData.append("messageText", text);
      if (file) formData.append("messageImage", file);
      formData.append("messageTime", time);

      // Reset preview and input
      setPreview(false);
      setMessageText("");
      inputFile.current.value = "";

      try {
        const response = await fetch(
          `${backendUrl}/api/chats/${selectedUser._id}`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
        const json = await response.json();
        if (response.status === 200) {
          const receiverStatus = onlineUsers.find(
            (u) => u._id === json.newMessage.receiverId
          );
          if (!receiverStatus) {
            dispatch(changeStatus(json.newMessage));
          }
          setSendingMessage(false);
          setPreviewUrl(null);
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setSendingMessage(false);
      }
    }

    if (selectedGroup) {
      try {
        if (selectedGroup.pastMembers.includes(userAuth._id)) {
          throw new Error("You are not a member of this group");
        }
      } catch (error) {
        toast.error(error.message);
        setMessageText("");
        inputFile.current.value = "";
        setSendingMessage(false);
        setPreview(false);
        setPreviewUrl(null);
        return;
      }

      const file = myForm.messageFile && myForm.messageFile.files[0];
      if (!text && !file) return;

      const formData = new FormData();
      if (text) formData.append("messageText", text);
      if (file) formData.append("messageImage", file);

      try {
        clientSocket?.emit("addGroupMessage", {
          selectedGroup: selectedGroup._id,
          messageBody: {
            messageText: text,
            messageImage: previewUrl,
            createdAt: new Date(),
          },
        });
        const response = await fetch(
          `${backendUrl}/api/groups/group/${selectedGroup._id}/message`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
        const json = await response.json();
        if (response.status === 200) {
          dispatch(setGroupChat(json.group));
          setMessageText("");
          inputFile.current.value = "";
          setSendingMessage(false);
          setPreview(false);
          setPreviewUrl(null);
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setSendingMessage(false);
      }
    }
  };

  useEffect(() => {
    if (chats && selectedUser) {
      const targetChats = chats.filter(
        (c) =>
          c.senderId === userAuth._id &&
          c.receiverId === selectedUser._id &&
          c.status === "sent"
      );
      const targetChats2 = chats.filter(
        (c) =>
          c.senderId === userAuth._id &&
          c.receiverId === selectedUser._id &&
          c.status === "delivered"
      );
      const receiverStatus = onlineUsers.find((e) => e._id === selectedUser._id);
      if (!receiverStatus) {
        targetChats.forEach((chat) => {
          dispatch(changeStatus({ ...chat, status: "delivered" }));
        });
      }
      if (receiverStatus) {
        targetChats2.forEach((chat) => {
          dispatch(changeStatus({ ...chat, status: "sent" }));
        });
      }
    }
  }, [onlineUsers, selectedUser]);

  return (
    <>
      <Box sx={{ width: "fit-content" }}>
        {preview && inputFile.current && inputFile.current.files[0] && (
          <div style={{ position: "absolute", bottom: "80px", left: "10px" }}>
            <img src={previewUrl} height="100px" width="100px" alt="preview" />
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
      </Box>
      <form
        ref={form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(form.current);
        }}
      >
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
              if (!(messageText.length > 0 || preview)) {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                }
              }
            }}
            sx={{ flexGrow: "1" }}
          />
          <Box
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
            sx={{
              "& svg": {
                height: "56px",
                margin: "0px 0.4rem",
                fontSize: "2.2rem",
              },
            }}
          >
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
            <label>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  form.current.requestSubmit();
                }}
                disabled={!(messageText.length > 0 || preview) || isSendingMessage}
              >
                <SendIcon />
              </Button>
            </label>
          </Box>
        </div>
      </form>
    </>
  );
}

export default CreateMessage;
