import { Box, Typography, CircularProgress, FormControlLabel, Switch } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

function Settings() {
  const selectedUser = useSelector((store) => store.selectedUser);
  
  if (!selectedUser) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  let chats = useSelector((store) => {
    return store.chats;
  });
  return (
    <Box sx={{ padding: "0.25rem" }}>
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
            border: "2px solid #ddd",
          }}
        >
          <Typography variant="h6">Setting</Typography>
        </Box>
        <Box sx={{ width: "100%", padding:"0.5rem"}}>
        <FormControlLabel control={<Switch  />} label="Mute Notifications" />
        </Box>
      </Box>
    </Box>
  );
}
// defaultChecked

export default Settings;
