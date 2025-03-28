import {
  Box,
  Typography,
  Avatar,
  Card,
  CardMedia,
  CardContent,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { setmessageImagePreviewUrl } from "../../../redux/features/messageImagePreviewUrl";
import { messageImagePreviewToggle } from "../../../redux/features/messageImagePreview";
import { backendContext } from "../../../BackendProvider";
import { setSelectedChat } from "../../../redux/features/selectedChat";
import {
  changeStatus,
  editChats,
  removeChats,
  updateChats,
} from "../../../redux/features/Chats";
import { socketContext } from "../../../SocketProvider";
import toast from "react-hot-toast";
import { seteditMessageToggle } from "../../../redux/features/editMessageToggle";
import EditMessage from "./EditMessage.jsx";

function ChatBody() {
  const selectedUser = useSelector((store) => store.selectedUser);
  let selectedChat = useSelector((store) => store.selectedChat);
  const [contextMenu, setContextMenu] = useState(null);
  const userAuth = useSelector((store) => store.userAuth);
  const chats = useSelector((store) => store.chats);
  const chatContainer = useRef();
  const scrollTo = useRef();

  const backendUrl = useContext(backendContext);
  const dispatch = useDispatch();
  let clientSocket = useContext(socketContext);
  let onlineUsers = useSelector((store) => store.onlineUsers);
  const handleImagePreview = (imageUrl) => {
    dispatch(setmessageImagePreviewUrl(imageUrl));
    dispatch(messageImagePreviewToggle());
  };

  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  }, [chats]);

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  let lastDate = null;

  // Handle right-click
  const handleContextMenu = (event, chat) => {
    event.preventDefault();
    dispatch(setSelectedChat(chat));
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  // Handle menu close
  const handleClose = () => {
    setContextMenu(null);
    // dispatch(setSelectedChat(null));
  };

  // Handle edit and delete
  const handleEdit = () => {
    console.log("Edit message:", selectedChat);
    // toast.success("coming soon");
    dispatch(seteditMessageToggle(true));
    handleClose();
  };

  const handleDelete = async () => {
    console.log("Delete message:", selectedChat);
    dispatch(
      editChats({
        senderId: userAuth._id,
        receiverId: selectedUser._id,
        text: "This message was deleted",
        image: { local_url: "", cloud_url: "" },
        createdAt: selectedChat.createdAt,
        status: "deleting message...",
        isGroupChat: selectedChat.isGroupChat,
      })
    );

    clientSocket?.emit("deleteMessage", {
      senderId: userAuth._id,
      receiverId: selectedUser._id,
      text: "This message was deleted",
      image: null,
      createdAt: selectedChat.createdAt,
      status: "deleting message...",
      isGroupChat: selectedChat.isGroupChat,
    });

    try {
      const response = await fetch(`${backendUrl}/api/chats/`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...selectedChat,
          image: { local_url: "", cloud_url: "" },
        }),
      });
      let json = await response.json();
      if (response.status == 200) {
        console.log("MEssage after saving to database:", json.message); //json.message is an Array
        console.log("onlineUsers sdf:",onlineUsers);
        
        const receiver = onlineUsers.find(
          (u) => u._id === json.message[0].receiverId
        );
        const receiverStatus = !!receiver; // Converts `receiver` to a boolean
        console.log(receiverStatus);

        if (!receiverStatus || selectedUser.isAi) {
          console.log("FUOAJDPOJ{OJ123123123");

          json.message.forEach((e) => {
            dispatch(editChats(e));
          });
          //   if (c.senderId === action.payload.senderId &&
          //     c.isGroupChat === action.payload.isGroupChat &&
          //     c.receiverId === action.payload.receiverId &&
          //     c.createdAt === action.payload.createdAt) {
          //      false
          // }
          if (selectedUser.isAi) {
            console.log("AI HCATASFMAJFPAJWF");
            json.message.forEach((e) => {
              dispatch(editChats({ ...e, status: "processed" }));
            });
            console.log("CHATS", chats);

            chats.forEach((e) => {
              dispatch(
                removeChats({
                  senderId: json.message[0].receiverId,
                  receiverId: json.message[0].senderId,
                  createdAt: json.message[0].createdAt,
                  isGroupChat: json.message[0].isGroupChat,
                })
              );
            });
          }
        }
      } else {
        throw new Error(json.message);
      }
    } catch (error) {
      console.error("Error in delete Message:", error.message);
      toast.error(error.message);
    } finally {
      handleClose();
      dispatch(setSelectedChat(null));
    }
  };
  let pressTimer = null;
  const handleTouchStart = (event, chat) => {
    pressTimer = setTimeout(() => {
      const touch = event.touches[0]; // Get touch position
      dispatch(setSelectedChat(chat));
      setContextMenu({
        mouseX: touch.clientX,
        mouseY: touch.clientY,
      });
    }, 1000); // Trigger after 200ms
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer); // Clear if the user releases early
  };

  return (
    <Box
      ref={chatContainer}
      sx={{
        height: "80%",
        overflow: "auto",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { width: "0.375rem" },
        "&::-webkit-scrollbar-thumb": {
          background: "linear-gradient(45deg, #1976d2, #42a5f5)",
          borderRadius: "0.5rem",
        },
        width: "100%",
        // border: "2px solid #1976d2",
        borderRadius: "0.75rem",
        padding: "16px",
        background: "linear-gradient(135deg, #f0f4f8 0%, #e3f2fd 100%)",
        boxShadow: "0 0.25rem 1.25rem rgba(0, 0, 0, 0.1)",
      }}
    >
      {chats.length > 0 ? (
        chats.map((chat) => {
          if (!chat.isGroupChat) {
            const isSender = chat.senderId === userAuth._id;
            const profilePic = isSender
              ? userAuth.profilePic?.cloud_url
              : selectedUser.profilePic?.cloud_url;
            const currentMessageDate = formatDate(chat.createdAt);
            const showDate = currentMessageDate !== lastDate;
            lastDate = currentMessageDate;

            return (
              <React.Fragment key={chat._id}>
                {showDate && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      my: 3,
                      width: "100%",
                    }}
                  >
                    <EditMessage selectedChat={selectedChat}></EditMessage>
                    <Typography
                      sx={{
                        background: "linear-gradient(45deg, #e1e1e1, #ffffff)",

                        color: "#444",
                        fontSize: "0.9rem",
                        padding: "0.375rem 1rem",
                        borderRadius: "1.25rem",
                        fontWeight: "600",
                        boxShadow: "0 0.125rem 0.375rem rgba(0, 0, 0, 0.1)",
                        textShadow: "0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      {currentMessageDate}
                    </Typography>
                  </Box>
                )}

                <Box
                  key={chat._id}
                  sx={{
                    display: "flex",
                    gap: "0.375rem",
                    flexDirection: isSender ? "row-reverse" : "row",
                    alignItems: "flex-end",
                    width: "100%",
                    marginBottom: "1.25rem",
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-0.125rem)" },
                  }}
                >
                  <Box
                    onContextMenu={
                      isSender ? (e) => handleContextMenu(e, chat) : () => {}
                    }
                    onTouchStart={
                      isSender ? (e) => handleTouchStart(e, chat) : () => {}
                    } // Mobile (Start long press)
                    onTouchEnd={handleTouchEnd} // Cancel if released early
                    className="chat-container-main"
                  >
                    <Avatar
                      src={
                        profilePic ||
                        `${backendUrl}/images/default_profile_icon.png`
                      }
                      sx={{
                        width: 40,
                        height: 40,
                        justifySelf: isSender ? "flex-end" : "flex-start",
                        border: "0.125rem solid #fff",
                        boxShadow: "0 0 0.5rem rgba(25, 118, 210, 0.5)",
                        transition: "box-shadow 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 0 0.75rem rgba(25, 118, 210, 0.7)",
                        },
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isSender ? "flex-end" : "flex-start",
                        maxWidth: "100%",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          marginBottom: "0.375rem",
                          fontWeight: "500",
                          textShadow:
                            "0 0.0625rem 0.0625rem rgba(0, 0, 0, 0.05)",
                          "&:hover": { color: "#1976d2" },
                        }}
                      >
                        {isSender ? "You" : selectedUser.fullName}
                      </Typography>

                      {chat.image && chat.image.cloud_url ? (
                        <Box
                          sx={{
                            background: isSender
                              ? "linear-gradient(45deg, #dcf8c6, #e8f5e9)"
                              : "linear-gradient(45deg, #ffffff, #f5f5f5)",
                            padding: "0.625rem",
                            borderRadius: "1.125rem",
                            boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)",
                            width: "100%",
                            // maxWidth: "400px",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 0.375rem 1rem rgba(0, 0, 0, 0.15)",
                            },
                          }}
                        >
                          <Card
                            sx={{
                              borderRadius: "1.125rem",
                              boxShadow: "none",
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={chat.image.cloud_url}
                              alt="Chat Image"
                              sx={{
                                width: "100%",
                                height: "auto",
                                borderRadius: "0.875rem",
                                cursor: "pointer",
                                // maxWidth: "400px",
                                transition: "transform 0.3s ease",
                                "&:hover": { transform: "scale(1.03)" },
                              }}
                              onClick={() =>
                                handleImagePreview(chat.image.cloud_url)
                              }
                            />
                          </Card>
                          {chat.text && (
                            <CardContent sx={{ padding: "0.375rem 0.625rem" }}>
                              <Typography
                                variant="body2"
                                className="chat-container "
                                sx={{
                                  overflow: "auto",
                                  wordBreak: "break-word",
                                  whiteSpace: "pre-wrap",
                                  fontWeight: "400",
                                  color: "#333",
                                }}
                              >
                                <Box
                                  sx={{
                                    overflowX: "auto",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    whiteSpace: "pre-wrap",
                                    maxWidth: "100%",
                                  }}
                                >
                                  <ReactMarkdown>{chat.text}</ReactMarkdown>
                                </Box>
                              </Typography>
                            </CardContent>
                          )}
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              textAlign: isSender ? "right" : "left",
                              color: "#888",
                              fontSize: "0.75rem",
                              marginTop: "0.375rem",
                              background: "linear-gradient(90deg, #888, #bbb)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {formatTime(chat.createdAt)}
                            {isSender && ` - ${chat.status}`}{" "}
                            {/* Status only for sender */}
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            background: isSender
                              ? "linear-gradient(45deg, #dcf8c6, #e8f5e9)"
                              : "linear-gradient(45deg, #ffffff, #f5f5f5)",
                            padding: "0.75rem 1rem", // Adjusted from 5px to 0.3125rem
                            borderRadius: "1.125rem",
                            width: "100%",
                            boxSizing: "border-box",
                            boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 0.375rem 1rem rgba(0, 0, 0, 0.15)",
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            className="chat-container "
                            sx={{
                              wordBreak: "break-all",
                              overflowWrap: "break-all",
                              overflow: "auto",
                              position: "relative",
                              whiteSpace: "pre-wrap",
                              fontWeight: "400",
                              color: "#333",
                            }}
                          >
                            <Box
                              sx={{
                                overflowX: "auto",
                                position: "relative",
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "pre-wrap",
                                maxWidth: "100%",
                              }}
                            >
                              <ReactMarkdown>{chat.text}</ReactMarkdown>
                            </Box>
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              textAlign: isSender ? "right" : "left",
                              color: "#888",
                              fontSize: "0.75rem",
                              marginTop: "0.375rem",
                              background: "linear-gradient(90deg, #888, #bbb)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {formatTime(chat.createdAt)}
                            {isSender && ` - ${chat.status}`}{" "}
                            {/* Status only for sender */}
                          </Typography>
                        </Box>
                      )}
                      <Menu
                        open={contextMenu}
                        onClose={handleClose}
                        anchorReference="anchorPosition"
                        sx={{
                          "& .MuiPaper-root": {
                            boxShadow: "none", // Removes shadow
                            border: "1px solid #ccc", // Optional: adds a subtle border for better visibility
                            backgroundColor: "#fff", // Optional: Ensures consistent background color
                          },
                        }}
                        anchorPosition={
                          contextMenu
                            ? {
                                top: contextMenu.mouseY,
                                left: contextMenu.mouseX,
                              }
                            : undefined
                        }
                      >
                        {!selectedUser.isAi?<MenuItem onClick={handleEdit}>Edit</MenuItem>:null}
                        {<MenuItem onClick={handleDelete}>Delete</MenuItem>}
                      </Menu>
                    </Box>
                  </Box>
                </Box>
              </React.Fragment>
            );
          }
          return null;
        })
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bolder",
              fontSize: "2.5rem",
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)",
            }}
          >
            No messages!
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "#666",
              fontStyle: "italic",
              textShadow: "0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05)",
            }}
          >
            Start a beautiful conversation!
          </Typography>
        </Box>
      )}
      <div ref={scrollTo} style={{ visibility: "none" }}></div>
    </Box>
  );
}

export default ChatBody;
