import { Box, Typography, Skeleton } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

function ChatBody() {
  let selectedUser = useSelector((store) => store.selectedUser);
  let userAuth = useSelector((store) => store.userAuth);
  let chats = useSelector((store) => store.chats);
  let chatContainer=useRef()
 let scrollTo=useRef();
 useEffect(()=>{
    scrollTo.current.scrollIntoView({ behavior: "smooth" });
 })
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
      {chats.map((chat) => {
        const isSender = chat.senderId === userAuth._id;
        const profilePic = isSender
          ? userAuth.profilePic.cloud_url
          : selectedUser.profilePic.cloud_url;

        return (
          <Box
            key={chat.id || chat._id}
            sx={{
              display: "flex",
              gap: "2px",
              flexDirection: "row",
              marginBottom: "20px",
            }}
          >
            {isSender ? (
              <>
                {/* Sender */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <img
                      src={profilePic}
                      width={70}
                      height={70}
                      alt="Profile"
                    />
                    {chat.image && chat.image.cloud_url ? (
                      <div
                        className="card"
                        style={{
                          width: "18rem",
                          borderRadius: "1rem",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <img
                          src={chat.image.cloud_url}
                          className="card-img-top rounded-top"
                          alt="Chat Image"
                          style={{ height: "12rem", width: "100%" }}
                        />
                        <div className="card-body text-center">
                          <Typography
                            variant="body2"
                            className="card-text bg-light p-3 rounded"
                          >
                            {chat.text}
                          </Typography>
                        </div>
                      </div>
                    ) : (
                      <Typography
                        variant="body1"
                        style={{
                          backgroundColor: "#f0f0f0",
                          padding: "10px",
                          borderRadius: "8px",
                          wordBreak: "break-all",
                          maxWidth: "300px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {chat.text}
                      </Typography>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Receiver */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <img
                      src={profilePic}
                      width={70}
                      height={70}
                      alt="Profile"
                    />
                    {chat.image && chat.image.cloud_url ? (
                      <div
                        className="card"
                        style={{
                          width: "18rem",
                          borderRadius: "1rem",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <img
                          src={chat.image.cloud_url}
                          className="card-img-top rounded-top"
                          alt="Chat Image"
                          style={{ height: "12rem", objectFit: "cover" }}
                        />
                        <div className="card-body text-center">
                          <Typography
                            variant="body2"
                            className="card-text bg-light p-3 rounded"
                          >
                            {chat.text}
                          </Typography>
                        </div>
                      </div>
                    ) : (
                      <Typography
                        variant="body1"
                        style={{
                          backgroundColor: "#f0f0f0",
                          padding: "10px",
                          wordBreak:"break-all",
                          borderRadius: "8px",
                          maxWidth: "300px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {chat.text}
                      </Typography>
                    )}
                  </div>
                </div>
              </>
            )}
          </Box>
        );
        
      })}
      <div ref={scrollTo} style={{visibility:"hidden"}}></div>
    </div>
  );
}

export default ChatBody;
