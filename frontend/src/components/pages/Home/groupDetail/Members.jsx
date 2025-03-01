import { Box, Button, Typography, CircularProgress } from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function Members() {
  const dispatch = useDispatch();
  const selectedGroup = useSelector((store) => store.selectedGroup);
  const groupChat = useSelector((store) => store.groupChat);
  const userAuth = useSelector((store) => store.userAuth);

  const handleKickMember = (memberId) => {
    // Dispatch an action or call API to remove member
    console.log("Kicking member with ID:", memberId);
  };

  if (!groupChat) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={"100%"}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Box
        sx={{
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          Members({groupChat?.groupMembers.length + 1})
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          border: "1px solid gray",
          margin: "0.5rem 0px",
        }}
      >
         <Button 
        variant="outlined"
        startIcon={<PersonAddIcon />}
        sx={{
          textTransform: "none",
          width: "100%",
          mx: "auto",
        }}
        onClick={() => {
          // Add your "add member" functionality here
          console.log("Add member button clicked");
        }}
      >
        Add Members
      </Button>
      </Box>
      
      <Box>
        {groupChat?.groupAdmin?._id && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              border: "1px solid gray",
              margin: "0.5rem 0px",
              justifyContent: "space-between",
              padding: "0.5rem",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Box
                sx={{
                  height: "40px",
                  width: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  border: "2px solid black",
                  overflow: "hidden",
                }}
              >
                <img
                  src={groupChat?.groupAdmin?.profilePic?.cloud_url}
                  height={"100%"}
                  width={"100%"}
                  alt="profile"
                />
              </Box>
              {groupChat?.groupAdmin?._id === userAuth._id
                ? "You"
                : groupChat.groupAdmin.fullName}{" "}
              <strong>(Admin)</strong>
            </Box>
          </Box>
        )}
        {groupChat?.groupMembers.map((member) => (
          <Box
            key={member._id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              border: "1px solid gray",
              margin: "0.5rem 0px",
              justifyContent: "space-between",
              padding: "0.5rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Box
                sx={{
                  height: "40px",
                  width: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  border: "2px solid black",
                  overflow: "hidden",
                }}
              >
                <img
                  src={member.profilePic?.cloud_url}
                  height={"100%"}
                  width={"100%"}
                  alt="profile"
                />
              </Box>
              {member._id == userAuth._id ? "You" : member.fullName}
            </Box>
            {userAuth._id == groupChat.groupAdmin._id ? (
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleKickMember(member._id)}
              >
                Kick
              </Button>
            ) : null}
          </Box>
        ))}
      </Box>
    </div>
  );
}

export default Members;
