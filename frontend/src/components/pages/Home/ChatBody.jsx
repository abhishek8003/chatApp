import {
  Box,
  Typography,
  Avatar,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import React, { useContext, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
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

  return (
    <Box
      ref={chatContainer}
      sx={{
        height: "80%",
        overflow: "auto",
        scrollbarWidth: "thin",
        width: "83%",
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
                      my: 2,
                      width: "100%",
                    }}
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
                    width: "100%",
                    marginBottom: "12px",
                  }}
                >
                  <Avatar
                    src={
                      profilePic ||
                      `${backendUrl}/images/default_profile_icon.png`
                    }
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isSender ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        marginBottom: "4px",
                      }}
                    >
                      {isSender ? "You" : selectedUser.fullName}
                    </Typography>

                    {chat.image && chat.image.cloud_url ? (
                      <Box
                        sx={{
                          backgroundColor: isSender ? "#dcf8c6" : "#ffffff",
                          padding: "6px",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          width: "100%",
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
                              maxWidth: "400px",
                            }}
                            onClick={() =>
                              handleImagePreview(chat.image.cloud_url)
                            }
                          />
                        </Card>
                        {chat.text && (
                          <CardContent sx={{ padding: "4px 8px" }}>
                            <Typography
                              variant="body2"
                              className="chat-container"
                              sx={{
                                // maxWidth: "250px",//fuck
                                overflow: "auto",
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
                              {/* {chat.text} */}
                            </Typography>
                          </CardContent>
                        )}
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
                      <Box
                        sx={{
                          backgroundColor: isSender ? "#dcf8c6" : "#ffffff",
                          padding: "8px 16px",
                          borderRadius: "12px",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <Typography
                          variant="body2"
                          className="chat-container"
                          sx={{
                            wordBreak: "break-all",
                            // maxWidth: "250px",//fuck
                            overflowWrap: "break-all",
                            overflow: "auto",
                            position:"relative"
                          }}
                        >
                          <Box
                            sx={{
                              overflowX: "auto",
                              position:"relative",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              whiteSpace: "pre-wrap",
                              maxWidth: "100%",
                            }}
                          >
                            <ReactMarkdown>{chat.text}</ReactMarkdown>
                          </Box>
                          {/* {chat.text} */}
                        </Typography>

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
                    )}
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
      <div ref={scrollTo} style={{ visibility: "none" }}></div>
    </Box>
  );
}

export default ChatBody;
