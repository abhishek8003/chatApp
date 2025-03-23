import {
  Box,
  Typography,
  Avatar,
  Card,
  CardMedia,
  CardContent,
  Alert,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setmessageImagePreviewUrl } from "../../../redux/features/messageImagePreviewUrl";
import { messageImagePreviewToggle } from "../../../redux/features/messageImagePreview";
import { backendContext } from "../../../BackendProvider";
import { editGroupChat } from "../../../redux/features/groupChats";
import { socketContext } from "../../../SocketProvider";
import toast from "react-hot-toast";

function GroupBody() {
  const userAuth = useSelector((store) => store.userAuth);
  const users = useSelector((store) => store.users);
  const groupChat = useSelector((store) => store.groupChat);
  const chatContainer = useRef();
  const scrollTo = useRef();
  const dispatch = useDispatch();
  const backendUrl = useContext(backendContext);
  let selectedGroup = useSelector((store) => store.selectedGroup);
  let [selectedGroupChat, setSelectedGroupChat] = useState(null);
  let clientSocket=useContext(socketContext)

  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTo({
        top: chatContainer.current.scrollHeight,
        // behavior: "smooth",
      });
    }
  }, [groupChat]);

  const handleImagePreview = (imageUrl) => {
    dispatch(setmessageImagePreviewUrl(imageUrl));
    dispatch(messageImagePreviewToggle());
  };

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
  const [contextMenu, setContextMenu] = useState(null);
  const handleContextMenu = (event, chat) => {
    event.preventDefault();
    console.log("selected group chat:", chat);
    setSelectedGroupChat(chat);
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  // Handle menu close
  const handleClose = () => {
    setContextMenu(null);
    setSelectedGroupChat(null);
  };

  // Handle edit and delete
  const handleEdit = () => {
    console.log("Edit message:", selectedGroupChat);
    handleClose();
  };

  const handleDelete = async () => {
    console.log("Delete message:", selectedGroupChat);
    dispatch(
      editGroupChat({
        createdAt: selectedGroupChat.createdAt,
        isGroupChat: selectedGroupChat.isGroupChat,
        receiverId: selectedGroupChat.receiverId,
        senderId: selectedGroupChat.senderId,
        status: "deleting message...",
        text: "This message was deleted",
      })
    );

    
    clientSocket?.emit("deleteGroupMessage", {...selectedGroupChat,text: "This message was deleted",});
    try {
      // /:group_id/deleteMessage/
      const response = await fetch(`${backendUrl}/api/groups/${selectedGroupChat._id}/deleteMessage`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...selectedGroupChat, image: { local_url: "", cloud_url: "" },}),
      });
      let json = await response.json();
      if (response.status == 200) {
        console.log("MEssage after saving to database:", json.message);//json.message is an Array
        dispatch(editGroupChat(json.message))

      } else {
        throw new Error(json.message);
      }
    } catch (error) {
      console.error("Error in delete Message:", error);
      toast.error(error);
    } finally {
      handleClose();
    }
  
  };
  let pressTimer = null;
  const handleTouchStart = (event, chat) => {
    pressTimer = setTimeout(() => {
      const touch = event.touches[0]; // Get touch position
      setSelectedGroupChat(chat);
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
        "&::-webkit-scrollbar": { width: "0.375rem" }, // 6px
        "&::-webkit-scrollbar-thumb": {
          background: "linear-gradient(45deg, #1976d2, #42a5f5)",
          borderRadius: "0.5rem", // 8px
        },
        width: "100%",
        // border: "0.125rem solid #1976d2", // 2px
        borderRadius: "0.75rem", // 12px
        padding: "1rem", // 16px
        background: "linear-gradient(135deg, #f0f4f8 0%, #e3f2fd 100%)",
        boxShadow: "0 0.25rem 1.25rem rgba(0, 0, 0, 0.1)", // 4px 20px
      }}
    >
      {groupChat?.groupMessages?.length > 0 ? (
        <>
          {groupChat.groupMessages.map((chat, index) => {
            let isKicked = selectedGroup.pastMembers.includes(
              chat.senderId._id
            );
            const isSender = chat.senderId._id === userAuth._id;
            const senderName = chat.senderId.fullName;
            const profilePic = isSender
              ? userAuth.profilePic?.cloud_url
              : users.find((u) => u._id === chat.senderId._id)?.profilePic
                  .cloud_url;

            const currentMessageDate = formatDate(chat.createdAt);
            const showDate = currentMessageDate !== lastDate;
            lastDate = currentMessageDate;

            return (
              <React.Fragment key={chat._id}>
                {/* Date Separator */}
                {showDate && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      my: 3,
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        background: "linear-gradient(45deg, #e1e1e1, #ffffff)",
                        color: "#444",
                        fontSize: "0.9rem",
                        padding: "0.375rem 1rem", // 6px 16px
                        borderRadius: "1.25rem", // 20px
                        fontWeight: "600",
                        boxShadow: "0 0.125rem 0.375rem rgba(0, 0, 0, 0.1)", // 2px 6px
                        textShadow: "0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05)", // 1px 2px
                      }}
                    >
                      {currentMessageDate}
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    gap: "0.375rem", // 6px
                    flexDirection: isSender ? "row-reverse" : "row",
                    alignItems: "flex-end",
                    width: "100%",
                    marginBottom: "1.25rem", // 20px
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-0.125rem)" }, // -2px
                  }}
                >
                  <Box
                    className="chat-container-main "
                    onContextMenu={
                      isSender ? (e) => handleContextMenu(e, chat) : () => {}
                    }
                    onTouchStart={
                      isSender ? (e) => handleTouchStart(e, chat) : () => {}
                    } // Mobile (Start long press)
                    onTouchEnd={handleTouchEnd} // Cancel if released early
                  >
                    <Avatar
                      src={
                        profilePic ||
                        `${backendUrl}/images/default_group_icon.png`
                      }
                      sx={{
                        justifySelf: isSender ? "flex-end" : "flex-start",
                        width: 40,
                        height: 40,
                        border: "0.125rem solid #fff", // 2px
                        boxShadow: "0 0 0.5rem rgba(25, 118, 210, 0.5)", // 8px
                        transition: "box-shadow 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 0 0.75rem rgba(25, 118, 210, 0.7)", // 12px
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
                      {/* Sender Name */}
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          marginBottom: "0.375rem", // 6px
                          fontWeight: "500",
                          textShadow:
                            "0 0.0625rem 0.0625rem rgba(0, 0, 0, 0.05)", // 1px 1px
                          "&:hover": { color: "#1976d2" },
                        }}
                      >
                        {isSender ? "You" : senderName}{" "}
                        {isKicked ? "(Kicked)" : null}
                      </Typography>

                      {/* Image Message */}
                      {chat.image && chat.image.cloud_url ? (
                        <Box
                          sx={{
                            width: "100%",
                            background: isSender
                              ? "linear-gradient(45deg, #dcf8c6, #e8f5e9)"
                              : "linear-gradient(45deg, #ffffff, #f5f5f5)",
                            padding: "0.625rem", // 10px
                            borderRadius: "1.125rem", // 18px
                            boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)", // 4px 12px
                            // width: "100%",
                            // maxWidth: "400px",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 0.375rem 1rem rgba(0, 0, 0, 0.15)", // 6px 16px
                            },
                          }}
                        >
                          <Card
                            sx={{
                              borderRadius: "1.125rem", // 18px
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
                                borderRadius: "0.875rem", // 14px
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

                          {/* Text below image */}
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
                                {chat.text}
                              </Typography>
                            </CardContent>
                          )}

                          {/* Timestamp for Image */}
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              textAlign: isSender ? "right" : "left",
                              color: "#888",
                              fontSize: "0.75rem",
                              marginTop: "0.375rem", // 6px
                              background: "linear-gradient(90deg, #888, #bbb)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {formatTime(chat.createdAt)}
                            {isSender && ` - ${chat.status}`}
                          </Typography>
                        </Box>
                      ) : (
                        /* Text Message */
                        <Box
                          sx={{
                            background: isSender
                              ? "linear-gradient(45deg, #dcf8c6, #e8f5e9)"
                              : "linear-gradient(45deg, #ffffff, #f5f5f5)",
                            padding: "0.75rem 1rem", // 12px 16px
                            borderRadius: "1.125rem", // 18px
                            width: "100%",
                            boxSizing: "border-box",
                            boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)", // 4px 12px
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 0.375rem 1rem rgba(0, 0, 0, 0.15)", // 6px 16px
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            className="chat-container"
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
                            {chat.text}
                          </Typography>

                          {/* Timestamp for Text */}
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              textAlign: isSender ? "right" : "left",
                              color: "#888",
                              fontSize: "0.75rem",
                              marginTop: "0.375rem", // 6px
                              background: "linear-gradient(90deg, #888, #bbb)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {formatTime(chat.createdAt)}
                            {isSender && ` - ${chat.status}`}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
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
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>
                </Box>
              </React.Fragment>
            );
          })}
          {selectedGroup.pastMembers.includes(userAuth._id) && (
            <Alert severity="warning">You were kicked by Admin!</Alert>
          )}
        </>
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
              textShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)", // 2px 4px
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
              textShadow: "0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05)", // 1px 2px
            }}
          >
            Start a beautiful conversation!
          </Typography>
        </Box>
      )}

      <div ref={scrollTo} style={{ visibility: "hidden" }}></div>
    </Box>
  );
}

export default GroupBody;
