import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setmessageImagePreviewUrl } from "../../../redux/features/messageImagePreviewUrl";
import { messageImagePreviewToggle } from "../../../redux/features/messageImagePreview";

function ChatBody() {
  const selectedUser = useSelector((store) => store.selectedUser);
  const userAuth = useSelector((store) => store.userAuth);
  const chats = useSelector((store) => store.chats);
  const chatContainer = useRef();
  const scrollTo = useRef();
  let dispatch = useDispatch();

  let handleImagePreview = (imageUrl) => {
    console.log(imageUrl);
    dispatch(setmessageImagePreviewUrl(imageUrl));
    dispatch(messageImagePreviewToggle());
  };

  useEffect(() => {
    scrollTo.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <div
      ref={chatContainer}
      style={{
        height: "80%",
        overflow: "auto",
        scrollbarWidth: "thin",
        width: "100%",
        border: "2px solid blue",
      }}
    >
      {chats.length > 0 ? (
        chats.map((chat) => {
          const isSender = chat.senderId === userAuth._id;
          const profilePic = isSender
            ? userAuth.profilePic?.cloud_url
            : selectedUser.profilePic?.cloud_url;

          return (
            <Box
              key={chat.id}
              sx={{
                display: "flex",
                gap: "2px",
                flexDirection: "row",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: isSender ? "flex-end" : "flex-start",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex" }}>
                  <img src={profilePic} width={50} height={50} alt="Profile" style={{ borderRadius: "50%" }} />
                  {chat.image && chat.image.cloud_url ? (
                    <div
                      className="card"
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        borderRadius: "1rem",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <img
                        src={chat.image.cloud_url}
                        onClick={() => {
                          handleImagePreview(chat.image.cloud_url);
                        }}
                        className="card-img-top rounded-top"
                        alt="Chat Image"
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "1rem",
                        }}
                      />
                      {chat.text && (
                        <div className="card-body text-center">
                          <Typography
                            variant="body2"
                            className="card-text bg-light p-3 rounded"
                          >
                            {chat.text}
                          </Typography>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Typography
                      variant="body1"
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "10px",
                        borderRadius: "8px",
                        wordBreak: "break-word",
                        maxWidth: "300px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {chat.text}
                    </Typography>
                  )}
                </div>
              </div>
            </Box>
          );
        })
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100%" }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bolder", fontSize: "2rem" }}>
            No messages!
          </Typography>
        </div>
      )}
      <div ref={scrollTo} style={{ visibility: "hidden" }}></div>
    </div>
  );
}

export default ChatBody;
