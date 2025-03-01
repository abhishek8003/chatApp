import { Box, Typography, CircularProgress, Button } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';

function Settings() {
  const groupChat = useSelector((store) => store.groupChat);
  
  if (!groupChat) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
 
  return (
    <Box sx={{ padding: "0.25rem" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1px",
          minHeight: "280px",
        }}
      >
        <Box
          sx={{
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Settings</Typography>
        </Box>
      
      {/* Button placed on a new line */}
      <Button 
        variant="outlined"
        startIcon={<DeleteIcon />}
        sx={{
          textTransform: "none",
          marginTop: 2,
          width: "100%",
          mx: "auto",
        }}
        onClick={() => {
          // Add your "add member" functionality here
          console.log("Add member button clicked");
        }}
      >
        Delete Group
      </Button>
      </Box>
    </Box>
  );
}

export default Settings;
