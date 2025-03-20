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
        "&::-webkit-scrollbar": { width: "0.375rem" },
        "&::-webkit-scrollbar-thumb": {
          background: "linear-gradient(45deg, #1976d2, #42a5f5)",
          borderRadius: "0.5rem",
        },
        width: "100%",
        border: "2px solid #1976d2",
        borderRadius: "0.75rem",
        padding: "2px",
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
                  <Avatar
                    src={
                      profilePic ||
                      `${backendUrl}/images/default_profile_icon.png`
                    }
                    sx={{
                      width: 40,
                      height: 40,
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
                      maxWidth: "90%",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        marginBottom: "0.375rem",
                        fontWeight: "500",
                        textShadow: "0 0.0625rem 0.0625rem rgba(0, 0, 0, 0.05)",
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
                          maxWidth: "400px",
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
                              maxWidth: "400px",
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
                              className="chat-container"
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
