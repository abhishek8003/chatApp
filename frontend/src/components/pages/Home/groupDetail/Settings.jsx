import { Box, Typography, CircularProgress, Button } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";

function Settings() {
  const groupChat = useSelector((store) => store.groupChat);

  if (!groupChat) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "18.75rem", // Matches GroupInfo min height (300px)
        }}
      >
        <CircularProgress sx={{ color: "#757575" }} /> {/* Medium gray spinner */}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "1rem", // 16px, matches parent padding
        display: "flex",
        flexDirection: "column",
        gap: "1rem", // 16px
        height: "100%",
        overflow: "auto",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "600",
            color: "#333", // Dark gray
            fontSize: "1.125rem", // 18px
          }}
        >
          Settings
        </Typography>
      </Box>

      {/* Delete Group Button */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem", // 8px
          flexGrow: 1,
          // justifyContent: "center", // Center vertically in available space
        }}
      >
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          sx={{
            textTransform: "none",
            width: "100%",
            maxWidth: "15rem", // 240px, limits button width
            borderColor: "#e0e0e0", // Subtle border
            color: "#d32f2f", // Soft red text
            borderRadius: "0.5rem", // 8px
            padding: "0.5rem 1rem", // 8px 16px
            fontSize: "0.875rem", // 14px
            "&:hover": {
              backgroundColor: "#ffebee", // Light red hover
              borderColor: "#d32f2f", // Red border on hover
            },
          }}
          onClick={() => {
            console.log("Delete group button clicked");
            // Add your delete group functionality here
          }}
        >
          Delete Group
        </Button>
        <Typography
          sx={{
            color: "#757575", // Medium gray
            fontSize: "0.75rem", // 12px
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          This action cannot be undone
        </Typography>
      </Box>
    </Box>
  );
}

export default Settings;