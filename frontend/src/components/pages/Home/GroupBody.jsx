import {
  Box,
  Typography,
  Avatar,
  Card,
  CardMedia,
  CardContent,
  Alert,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setmessageImagePreviewUrl } from "../../../redux/features/messageImagePreviewUrl";
import { messageImagePreviewToggle } from "../../../redux/features/messageImagePreview";
import { backendContext } from "../../../BackendProvider";

function GroupBody() {
  const userAuth = useSelector((store) => store.userAuth);
  const users = useSelector((store) => store.users);
  const groupChat = useSelector((store) => store.groupChat);
  const chatContainer = useRef();
  const scrollTo = useRef();
  const dispatch = useDispatch();
  const backendUrl = useContext(backendContext);
  let selectedGroup = useSelector((store) => store.selectedGroup);

  // Check if the user is in pastMembers
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

  return (
    <Box
      ref={chatContainer}
      sx={{
        height: "80%",
        overflow: "auto",
        scrollbarWidth: "thin",
        width: "100%",
        border: "2px solid #1976d2",
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Show alert if the user was kicked */}

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
                    sx={{ display: "flex", justifyContent: "center", my: 2 }}
                  >
                    <Typography
                      sx={{
                        backgroundColor: "#e1e1e1",
                        color: "#555",
                        fontSize: "0.85rem",
                        padding: "4px 12px",
                        borderRadius: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {currentMessageDate}
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    gap: "8px",
                    flexDirection: isSender ? "row-reverse" : "row",
                    alignItems: "flex-end",
                    marginBottom: "12px",
                  }}
                >
                  <Avatar
                    src={
                      profilePic ||
                      `${backendUrl}/images/default_group_icon.png`
                    }
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isSender ? "flex-end" : "flex-start",
                      maxWidth: "70%",
                    }}
                  >
                    {/* Sender Name */}
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", marginBottom: "4px" }}
                    >
                      {isSender ? "You" : senderName}&nbsp;
                      {isKicked ? "(Kicked)" : null}
                    </Typography>

                    {/* Image Message */}
                    {chat.image && chat.image.cloud_url ? (
                      <Box
                        sx={{
                          backgroundColor: isSender ? "#dcf8c6" : "#ffffff",
                          padding: "6px",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          maxWidth: "250px",
                        }}
                      >
                        <Card
                          sx={{
                            borderRadius: "12px",
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
                              borderRadius: "12px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleImagePreview(chat.image.cloud_url)
                            }
                          />
                        </Card>

                        {/* Text below image */}
                        {chat.text && (
                          <CardContent sx={{ padding: "4px 8px" }}>
                            <Typography
                              variant="body2"
                              sx={{ wordBreak: "break-word" }}
                            >
                              {chat.text}
                            </Typography>
                          </CardContent>
                        )}

                        {/* Timestamp for Image */}
                        {isSender && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              textAlign: "right",
                              color: "#808080",
                              fontSize: "0.75rem",
                              marginTop: "4px",
                            }}
                          >
                            {formatTime(chat.createdAt)} - {chat.status}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      /* Text Message */
                      <Box
                        sx={{
                          backgroundColor: isSender ? "#dcf8c6" : "#ffffff",
                          color: isSender ? "#000000" : "#000000",
                          padding: "8px 16px",
                          borderRadius: "12px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          wordBreak: "break-word",
                          position: "relative",
                          maxWidth: "250px",
                        }}
                      >
                        <Typography variant="body1">{chat.text}</Typography>

                        {/* Timestamp for Text */}
                        { isSender&&
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              textAlign: "right",
                              color: "#808080",
                              fontSize: "0.75rem",
                              marginTop: "4px",
                            }}
                          >
                            {formatTime(chat.createdAt)} - {chat.status}
                          </Typography>
                        }
                      </Box>
                    )}
                  </Box>
                </Box>
              </React.Fragment>
            );
          })}
          {selectedGroup.pastMembers.includes(userAuth._id) ? (
            <>
              <Alert severity="warning">You were kicked by Admin!</Alert>
            </>
          ) : null}
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bolder",
              fontSize: "2rem",
              color: "text.secondary",
            }}
          >
            No messages!
          </Typography>
        </Box>
      )}

      <div ref={scrollTo} style={{ visibility: "hidden" }}></div>
    </Box>
  );
}

export default GroupBody;
