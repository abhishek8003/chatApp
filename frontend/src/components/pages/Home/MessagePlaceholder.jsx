import { Box, Typography } from "@mui/material";
import React from "react";

function MessagePlaceholder() {
  return (
    <Box
      sx={{
        height: "100%", // Full height of chat area
        minWidth: "5rem", // 80px
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fafafa", // Light gray background
      }}
    >
      <Box
        sx={{
          padding: "2rem", // 32px
          borderRadius: "0.75rem", // 12px
          background: "#ffffff", // White card
          boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.05)", // Subtle shadow
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            "& i": {
              fontSize: "3rem", // 48px
              color: "#75757580", // Medium gray with transparency
              display: "block",
              marginBottom: "1rem", // 16px
            },
          }}
        >
          <i className="fa-duotone fa-solid fa-message fa-bounce" />
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#333", // Dark gray
            fontSize: "1.25rem", // 20px
            marginBottom: "1rem", // 16px
          }}
        >
          Welcome to Chatify!
        </Typography>
        <Typography
          sx={{
            color: "#757575", // Medium gray
            fontSize: "1rem", // 16px
            lineHeight: 1.5,
          }}
        >
          Select a conversation from the sidebar to start chatting
        </Typography>
      </Box>
    </Box>
  );
}

export default MessagePlaceholder;