import { Box, Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollectionsIcon from "@mui/icons-material/Collections";
import SendIcon from "@mui/icons-material/Send";
import { CircularProgress } from "@mui/material";
import {
  changeStatus,
  setChats,
  updateChats,
} from "../../../redux/features/Chats";
import toast from "react-hot-toast";
import { socketContext } from "../../../SocketProvider";
import { backendContext } from "../../../BackendProvider";
import {
  changeGroupMessageStatus,
  setGroupChat,
  updateGroupChat,
} from "../../../redux/features/groupChats";
import { uploadingToggle } from "../../../redux/features/uploading";
import { setKeepAliveInterval } from "../../../redux/features/keepAliveInterval";
import { addNewMessageInSelectedGroup } from "../../../redux/features/selectedGroup";
import { addNewMessageInGroups } from "../../../redux/features/groups";

function CreateMessage() {
  const selectedGroup = useSelector((store) => store.selectedGroup);
  const backendUrl = useContext(backendContext);
  const selectedUser = useSelector((store) => store.selectedUser);
  const inputFile = useRef();
  const clientSocket = useContext(socketContext);
  const chats = useSelector((store) => store.chats);
  const onlineUsers = useSelector((store) => store.onlineUsers);
  const [preview, setPreview] = useState(false);
  const keepAliveInterval = useSelector((store) => store.keepAliveInterval);
  const [previewUrl, setPreviewUrl] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSendingMessage, setSendingMessage] = useState(false);
  const uploading = useSelector((store) => store.uploading);
  const userAuth = useSelector((store) => store.userAuth);
  const dispatch = useDispatch();
  const form = useRef();

  const handleFilePreview = async () => {
    setTimeout(() => {
      setPreview(true);
      if (inputFile.current && inputFile.current.files[0]) {
        const fileObj = inputFile.current.files[0];
        const fileReader = new FileReader();
        fileReader.addEventListener("loadend", (e) => {
          console.log("File preview URL:", e.target.result);
          setPreviewUrl(e.target.result);
        });
        fileReader.readAsDataURL(fileObj);
      }
    }, 0);
  };

  const handleSendMessage = async (myForm) => {
    setSendingMessage(true);
    const time = new Date(Date.now()).toISOString();
    const text = myForm.newMessage.value;
    const imgTempUrl = previewUrl;

    try {
      if (selectedUser && !selectedUser.isAi) {
        // Regular user chat
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
        dispatch(uploadingToggle(true));

        clientSocket?.emit("sendMessage", {
          senderId: userAuth._id,
          recieverId: selectedUser._id,
          message_text: text,
          message_image: imgTempUrl,
          createdAt: time,
        });

        const file = myForm.messageFile?.files[0];
        if (!text && !file) {
          toast.error("Message or file required!");
          setSendingMessage(false);
          return;
        }

        const formData = new FormData();
        if (text) formData.append("messageText", text);
        if (file) formData.append("messageImage", file);
        formData.append("messageTime", time);

        setPreview(false);
        setMessageText("");
        if (inputFile.current) inputFile.current.value = ""; // Safe reset

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
          console.log("After saving to database:", json.newMessage);
          const receiverStatus = onlineUsers.some(
            (u) => u._id === json.newMessage.receiverId
          );
          if (!receiverStatus) {
            dispatch(changeStatus(json.newMessage));
          }
          setPreviewUrl(null);
        } else {
          throw new Error("Failed to save message");
        }
      } else if (selectedUser && selectedUser.isAi) {
        // AI chat
        if (!text) {
          toast.error("Message text required for AI chat!");
          setSendingMessage(false);
          return;
        }

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

        const formData = new FormData();
        formData.append("messageText", text);
        formData.append("messageTime", time);

        setPreview(false);
        setMessageText("");

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
          console.log("AI message saved:", json.newMessage);
          dispatch(
            changeStatus({
              senderId: userAuth._id,
              receiverId: selectedUser._id,
              text,
              image: { local_url: "", cloud_url: imgTempUrl },
              createdAt: time,
              status: "processed",
              isGroupChat: false,
            })
          );
          if (selectedUser._id === json.newMessage.senderId) {
            dispatch(updateChats(json.newMessage));
          }
          setPreviewUrl(null);
        } else {
          throw new Error("Failed to save AI message");
        }
      } else if (selectedGroup) {
        // Group chat
        if (!selectedGroup._id || !Array.isArray(selectedGroup.pastMembers)) {
          console.error("Invalid selectedGroup:", selectedGroup);
          toast.error("Invalid group selected!");
          setSendingMessage(false);
          return;
        }

        if (selectedGroup.pastMembers.includes(userAuth._id)) {
          toast.error("You are not a member of this group!");
          setMessageText("");
          setPreview(false);
          setPreviewUrl(null);
          setSendingMessage(false);
          return;
        }

        const file = myForm.messageFile?.files[0];
        if (!text && !file) {
          toast.error("Message or file required!");
          setSendingMessage(false);
          return;
        }

        const formData = new FormData();
        if (text) formData.append("messageText", text);
        if (file) formData.append("messageImage", file);

        dispatch(
          updateGroupChat({
            senderId: userAuth, // Fixed from userAuth
            receiverId: selectedGroup._id,
            text,
            image: { local_url: "", cloud_url: imgTempUrl },
            createdAt: time,
            status: "pending",
            isGroupChat: true,
          })
        );

        clientSocket?.emit("addGroupMessage", {
          selectedGroup: selectedGroup._id,
          messageBody: {
            messageText: text,
            messageImage: previewUrl,
            createdAt: time,
            status: "pending",
            isGroupChat: true, // Fixed to true
          },
        });

        setPreview(false);
        setMessageText("");
        if (inputFile.current) inputFile.current.value = ""; // Safe reset

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
          console.log("Group message saved:", json.newMessage);
          dispatch(changeGroupMessageStatus(json.newMessage));
          setPreviewUrl(null);
        } else {
          throw new Error("Failed to save group message");
        }
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setSendingMessage(false);
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

      const receiverStatus = onlineUsers.some(
        (e) => e._id === selectedUser._id
      );
      if (!receiverStatus) {
        targetChats.forEach((chat) =>
          dispatch(changeStatus({ ...chat, status: "delivered" }))
        );
      }
      if (receiverStatus) {
        targetChats2.forEach((chat) =>
          dispatch(changeStatus({ ...chat, status: "sent" }))
        );
      }
    }
  }, [onlineUsers, selectedUser, chats, dispatch, userAuth._id]);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        {preview && inputFile.current?.files[0] && (
          <div style={{ position: "absolute", bottom: "80px", left: "10px" }}>
            <img src={previewUrl} height="100px" width="100px" alt="Preview" />
            <i
              onClick={() => {
                if (inputFile.current) inputFile.current.value = "";
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
                cursor: "pointer",
              }}
            />
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
            position: "relative",
            border: "2px solid orange",
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
            sx={{ flexGrow: "1", border: "" }}
          />
          <Box
            style={{
              width: "fit-content",
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
            {selectedUser && !selectedUser.isAi && (
              <>
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
              </>
            )}
            {isSendingMessage ? (
              <Button
                onClick={(e) => e.preventDefault()}
                sx={{
                  minWidth: "auto", // Lets the button shrink to fit content
                  padding: "0", // Removes extra padding
                  height: "100%",
                  width: "100%",
                  boxSizing: "border-box",
                  // border: "1px solid black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress
                  size={"100%"}
                  sx={{
                    padding: "2px;",
                    margin: "0px",
                    "& svg": {
                      margin: "0px",
                    },
                  }}
                />
              </Button>
            ) : (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  form.current.requestSubmit();
                }}
                disabled={
                  !(messageText.length > 0 || preview) || isSendingMessage
                }
              >
                <SendIcon />
              </Button>
            )}
          </Box>
        </div>
      </form>
    </>
  );
}

export default CreateMessage;
