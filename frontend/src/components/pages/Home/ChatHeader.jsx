import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../../redux/features/selectedUser";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography } from "@mui/material";
import AccountInfo from "./AccountInfo";
import { setaccountInfoToggle } from "../../../redux/features/accountInfoToggle";

function ChatHeader() {
  let selectedUser = useSelector((store) => store.selectedUser);
  let dispatch = useDispatch();
  let typing = useSelector((store) => store.typing);
  let anchorElement = useRef();

  return (
    <div
      className="chat-head-main"
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#ffffff", // Clean white background
        borderBottom: "0.0625rem solid #e0e0e0", // 1px subtle border
        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.05)", // 2px 4px soft shadow
        padding: "0.75rem", // 12px
        borderRadius: "0.5rem 0.5rem 0 0", // 8px top corners only
      }}
    >
      {/* Left Section (User Info) */}
      <div
        style={{
          padding: "0.25rem", // 4px
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          transition: "background 0.2s ease",
          "&:hover": {
            background: "#f5f5f5", // Light gray hover
            borderRadius: "0.5rem", // 8px
          },
        }}
        ref={anchorElement}
        onClick={() => {
          console.log("Opening account info");
          dispatch(setaccountInfoToggle());
        }}
      >
        <Typography
          variant="h6"
          className="people_img"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "0.75rem", // 12px
          }}
        >
          <img
            src={selectedUser.profilePic.cloud_url}
            alt="Profile"
            style={{
              width: "2.5rem", // 40px
              height: "2.5rem", // 40px
              borderRadius: "50%",
              objectFit: "cover",
              border: "0.0625rem solid #e0e0e0", // 1px subtle border
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)", // Slight enlarge on hover
              },
            }}
          />
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#333", // Dark gray for contrast
              fontWeight: "500",
              fontSize: "1.125rem", // 18px
              textTransform: "capitalize",
            }}
          >
            {selectedUser.fullName[0].toUpperCase() + selectedUser.fullName.slice(1)}
          </Typography>
          {typing ? (
            <Typography
              sx={{
                color: "#757575", // Medium gray
                fontSize: "0.75rem", // 12px
                fontStyle: "italic",
                marginTop: "0.125rem", // 2px
              }}
            >
              Typing...
            </Typography>
          ) : null}
        </Box>
      </div>

      {/* Right Section (Close Button) */}
      <div
        style={{
          padding: "0.25rem", // 4px
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          transition: "background 0.2s ease",
          "&:hover": {
            background: "#f5f5f5", // Light gray hover
            borderRadius: "50%", // Circular hover area
          },
        }}
        onClick={() => {
          dispatch(setSelectedUser(null));
        }}
      >
        <CloseIcon
          sx={{
            fontSize: "1.75rem", // 28px
            color: "#757575", // Medium gray
            transition: "color 0.2s ease",
            "&:hover": {
              color: "#d32f2f", // Soft red on hover
            },
          }}
        />
      </div>

      <AccountInfo targetElement={anchorElement} />
    </div>
  );
}

export default ChatHeader;