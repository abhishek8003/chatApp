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
  let newMessageField=useRef();
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
        if (inputFile.current) inputFile.current.value = "";

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
          setSendingMessage(false);
          setPreviewUrl(null);
        } else {
          throw new Error("Failed to save message");
        }
      } else if (selectedUser && selectedUser.isAi) {
        // AI chat (no image support)
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
            image: { local_url: "", cloud_url: "" }, // No image for AI
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
              image: { local_url: "", cloud_url: "" },
              createdAt: time,
              status: "processed",
              isGroupChat: false,
            })
          );
          if (selectedUser._id === json.newMessage.senderId) {
            dispatch(updateChats(json.newMessage));
          }
          setSendingMessage(false);
          setPreviewUrl(null);
        } else {
          throw new Error("Failed to save AI message");
        }
      } else if (selectedGroup._id) {
        // Group chat (with image support)
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
        formData.append("messageTime", time);

        dispatch(
          updateGroupChat({
            senderId: userAuth,
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
            isGroupChat: true,
          },
        });

        setPreview(false);
        setMessageText("");
        if (inputFile.current) inputFile.current.value = "";

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
          setSendingMessage(false);
        } else {
          throw new Error("Failed to save group message");
        }
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setSendingMessage(false);
      setMessageText("");
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
    <Box
      sx={{
        width: "100%",
        position: "relative",
        padding: "0.5rem", // 8px
        background: "rgba(255, 255, 255, 0.9)", // Semi-transparent white for glass effect
        backdropFilter: "blur(8px)", // Glassmorphism blur
        borderTop: "1px solid rgba(255, 255, 255, 0.2)", // Subtle glass border
        boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.05)", // Softer shadow
      }}
    >
      {/* File Preview */}
      {preview && inputFile.current?.files[0] && (
        <Box
          sx={{
            position: "absolute",
            bottom: "5rem", // Adjusted to account for potential TextField growth
            left: "0.75rem", // 12px
            display: "flex",
            alignItems: "center",
            gap: "0.5rem", // 8px
            background: "rgba(255, 255, 255, 0.9)", // Glass effect
            backdropFilter: "blur(8px)",
            padding: "0.5rem", // 8px
            borderRadius: "0.5rem", // 8px
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // 2px 4px
            border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle glass border
            zIndex: 10,
          }}
        >
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              height: "6.25rem", // 100px
              width: "6.25rem", // 100px
              objectFit: "cover",
              borderRadius: "0.25rem", // 4px
            }}
          />
          <Box
            component="i"
            className="fa-solid fa-square-xmark"
            sx={{
              color: "#d32f2f", // Soft red
              fontSize: "1.5rem", // 24px
              cursor: "pointer",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "#b71c1c", // Darker red on hover
              },
            }}
            onClick={() => {
              if (inputFile.current) inputFile.current.value = "";
              setPreview(false);
              setPreviewUrl(null);
            }}
          />
        </Box>
      )}

      {/* Message Input Form */}
      <form
        ref={form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(form.current);
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end", // Align items to the bottom to handle multiline growth
            gap: "0.5rem", // 8px
            background: "rgba(255, 255, 255, 0.5)", // Subtle glass effect
            backdropFilter: "blur(4px)",
            borderRadius: "0.75rem", // 12px
            padding: "0.75rem", 
            border: "0.0625rem solid rgb(224, 224, 224)",
            "&:hover": {
              borderColor: "rgba(0, 0, 0, 0.2)", // Slightly darker on hover
            },
          }}
        >
          <TextField
            placeholder="Type a message..."
            autoComplete="off"
            value={messageText}
            multiline
            maxRows={4} // Limit the number of rows to prevent excessive growth
            name="newMessage"
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && (messageText.trim().length || Boolean(preview))) {
                // If Enter is pressed without Shift, submit the form if there is content 
                form.current.requestSubmit();
                setMessageText("");
                
              } else if (e.key === "Enter" && e.shiftKey) {
                e.preventDefault(); 
                setMessageText((prev) => prev + "\n"); 
              }
            }}
            sx={{
              flexGrow: 1,
              "& .MuiInputBase-root": {
                padding: "0px", 
                background: "transparent",
                "& fieldset": { border: "none" }, // Remove default border
                "&:hover fieldset": { border: "none" },
                "&.Mui-focused fieldset": { border: "none" },
              },
              "& .MuiInputBase-input": {
                padding: "0px", // 8px vertical padding
                fontSize: "0.875rem", // 14px
                color: "#333", // Dark gray text
                lineHeight: "1.25rem", // Ensure consistent line height
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // Center icons vertically
              gap: "0.5rem", // 8px
              paddingBottom: "0rem", // Align with TextField's padding
            }}
          >
            {/* Show file input for both regular user chats and group chats */}
            {(selectedUser && !selectedUser.isAi) || selectedGroup ? (
              <>
                <label htmlFor="messageFile">
                  <CollectionsIcon
                    sx={{
                      fontSize: "1.75rem", // 28px
                      color: "#757575", // Medium gray
                      cursor: "pointer",
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "#333", // Dark gray on hover
                      },
                    }}
                  />
                </label>
                <input
                  type="file"
                  ref={inputFile}
                  id="messageFile"
                  name="messageFile"
                  onChange={() => {
                    console.log("IMAGWE Ggw2342342342424234");
                    handleFilePreview();
                    document.querySelector('textarea[name="newMessage"]').focus();
                  }}
                  style={{ display: "none" }}
                />
              </>
            ) : null}
            {isSendingMessage ? (
              <CircularProgress
                size="1.75rem" // 28px
                sx={{
                  color: "#757575", // Medium gray
                  padding: "0.25rem", // 4px
                }}
              />
            ) : (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  form.current.requestSubmit();
                }}
                disabled={
                  !(messageText.trim().length > 0 || preview) || isSendingMessage
                }
                sx={{
                  minWidth: "auto",
                  padding: "0",
                }}
              >
                <SendIcon
                  sx={{
                    fontSize: "1.75rem", // 28px
                    color:
                      messageText.trim().length > 0 || preview ? "#1976d2" : "#bdbdbd", // Blue when active, gray when disabled
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color:
                        messageText.length > 0 || preview
                          ? "#115293"
                          : "#bdbdbd", // Darker blue on hover
                    },
                  }}
                />
              </Button>
            )}
          </Box>
        </Box>
      </form>
    </Box>
  );
}

export default CreateMessage;