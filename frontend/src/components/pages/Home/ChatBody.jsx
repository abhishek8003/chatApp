import { Box, Typography, Avatar, Card, CardMedia, CardContent } from "@mui/material";
import React, { useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setmessageImagePreviewUrl } from "../../../redux/features/messageImagePreviewUrl";
import { messageImagePreviewToggle } from "../../../redux/features/messageImagePreview";
import { backendContext } from "../../../BackendProvider";

function ChatBody() {
  const selectedUser = useSelector((store) => store.selectedUser);
  const userAuth = useSelector((store) => store.userAuth);
  const chats = useSelector((store) => store.chats);
  const chatContainer = useRef();
  const scrollTo = useRef();
  const backendUrl = useContext(backendContext);
  const dispatch = useDispatch();

  const handleImagePreview = (imageUrl) => {
    dispatch(setmessageImagePreviewUrl(imageUrl));
    dispatch(messageImagePreviewToggle());
  };

  useEffect(() => {
    scrollTo.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

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
      {chats.length > 0 ? (
        chats.map((chat) => {
          if (!chat.isGroupChat) {
            const isSender = chat.senderId === userAuth._id;
            const profilePic = isSender
              ? userAuth.profilePic?.cloud_url
              : selectedUser.profilePic?.cloud_url;

            return (
              <Box
                key={chat._id}
                sx={{
                  display: "flex",
                  gap: "8px",
                  flexDirection: isSender ? "row-reverse" : "row",
                  marginBottom: "16px",
                }}
              >
                <Avatar
                  src={profilePic || `${backendUrl}/images/default_profile_icon.png`}
                  sx={{ width: 50, height: 50 }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isSender ? "flex-end" : "flex-start",
                    maxWidth: "70%",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "text.secondary", marginBottom: "4px" }}>
                    {isSender ? "You" : selectedUser.fullName}
                  </Typography>
                  {chat.image && chat.image.cloud_url ? (
                    <Card
                      sx={{
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                          boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={chat.image.cloud_url}
                        alt="Chat Image"
                        sx={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "12px 12px 0 0",
                          cursor: "pointer",
                        }}
                        onClick={() => handleImagePreview(chat.image.cloud_url)}
                      />
                      {chat.text && (
                        <CardContent sx={{ padding: "8px 16px" }}>
                          <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                            {chat.text}
                          </Typography>
                        </CardContent>
                      )}
                    </Card>
                  ) : (
                    <Box
                      sx={{
                        backgroundColor: isSender ? "#1976d2" : "#ffffff",
                        color: isSender ? "#ffffff" : "#000000",
                        padding: "8px 16px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        wordBreak: "break-word",
                      }}
                    >
                      <Typography variant="body1">{chat.text}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          }
          return null; // Skip rendering for group chats
        })
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bolder", fontSize: "2rem", color: "text.secondary" }}>
            No messages!
          </Typography>
        </Box>
      )}
      <div ref={scrollTo} style={{ visibility: "hidden" }}></div>
    </Box>
  );
}

export default ChatBody;