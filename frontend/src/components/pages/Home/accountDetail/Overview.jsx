import { Box, Typography, CircularProgress } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const formatDate = date => date ? new Date(date).toLocaleString("en-IN") : "N/A";

function Overview() {
  const selectedUser = useSelector((store) => store.selectedUser);
  
  if (!selectedUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  let chats=useSelector((store)=>{
    return store.chats;
  })
  return (
    <Box sx={{ padding: "1.5rem" }}>
      {/* Profile Picture & Name */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
        <Box
          sx={{
            height: 100,
            width: 100,
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #ddd",
          }}
        >
          <img
            src={selectedUser?.profilePic?.cloud_url}
            alt="User Profile"
            height="100px"
            width="100px"
          />
        </Box>
        <Typography variant="h5" fontWeight="bold">
          {selectedUser?.fullName || "Unknown User"}
        </Typography>
      </Box>

      <hr style={{ margin: "1rem 0", border: "1px solid #ddd" }} />

      {/* Account Details */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <Typography variant="body1" fontWeight="bold" color="textSecondary">
            Created
          </Typography>
          <Typography variant="body2">{formatDate(selectedUser?.createdAt)}</Typography>
        </Box>

        <Box>
          <Typography variant="body1" fontWeight="bold" color="textSecondary">
            Last Message
          </Typography>
          <Typography variant="body2">{formatDate(chats[chats.length-1]?.createdAt)}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Overview;
