import { Box, Button, Typography, CircularProgress } from "@mui/material";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { backendContext } from "../../../../BackendProvider";
import toast from "react-hot-toast";
import { socketContext } from "../../../../SocketProvider";
import { setaddGroupMemberToggle } from "../../../../redux/features/addGroupMemberToggle";
import AddGroupMembers from "../../../AddGroupMembers";
import { removeMemberFromGroups } from "../../../../redux/features/groups";
import { removeMemberFromGroupChat } from "../../../../redux/features/groupChats";
import { removegroupCurrentMembers } from "../../../../redux/features/groupCurrentMembers";
import { addgroupPastMembers } from "../../../../redux/features/groupPastMembers";
import { removeMemberFromSelectedGroup } from "../../../../redux/features/selectedGroup";

function Members() {
  const groupChat = useSelector((store) => store.groupChat);
  const userAuth = useSelector((store) => store.userAuth);
  const users = useSelector((store) => store.users);
  const backendUrl = useContext(backendContext);
  const clientSocket = useContext(socketContext);
  let currentMembers = useSelector((store) => {
    return store.groupCurrentMembers;
  });
  let pastMembers = useSelector((store) => {
    return store.groupPastMembers;
  });
  let dispatch = useDispatch();
  let [newMembers, setNewMembers] = useState([]);

  const handleKickMember = async (groupId, memberEmail) => {
    try {
      let targetMember;
      let member = users.find((e) => {
        if (e.email == memberEmail) {
          return true;
        }
      });
      targetMember=member;
      let memberId = member?._id;


      if (!memberId) {
        if (userAuth.email == memberEmail) {
          memberId = userAuth._id;
        }
      }
      
      clientSocket?.emit("memberKick", { groupId, memberEmail });
      dispatch(removeMemberFromSelectedGroup({

      })); 
      
      const response = await fetch(
        `${backendUrl}/api/groups/${groupId}/deleteMember/${memberId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (response.status === 200) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error kicking member:", error);
      toast.error("Failed to kick member");
    }
  };
  if (!groupChat) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={"100%"}
      >
        <CircularProgress />
      </Box>
    );
  }
  console.log("Group:", groupChat);
  console.log("Group Members:", groupChat?.groupMembers);
  console.log("Past Members:", pastMembers);
  console.log("Current Members:", currentMembers);
  console.log("Users:", users);

  return (
    <div>
      {/* Group Title */}
      <Box
        sx={{
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // border:"2px solid red"
        }}
      >
        <Typography variant="h6">
          Members ({currentMembers.length + 1})
        </Typography>
      </Box>

      {/* Add Members Button */}
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
          sx={{ textTransform: "none", width: "100%", mx: "auto" }}
          onClick={() => {
            dispatch(setaddGroupMemberToggle());
          }}
        >
          Add Members
        </Button>
        <AddGroupMembers></AddGroupMembers>
      </Box>

      {/* Admin Section */}
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
                alt="Admin Profile"
              />
            </Box>
            {groupChat?.groupAdmin?._id === userAuth._id
              ? "You"
              : groupChat.groupAdmin.fullName}{" "}
            <strong>(Admin)</strong>
          </Box>
        </Box>
      )}

      {/* Current Members Section */}
      {currentMembers.length > 0 && (
        <>
          <Typography
            variant="h6"
            sx={{ marginTop: "1rem", fontWeight: "bold" }}
          >
            Current Members
          </Typography>
          <Box>
            {currentMembers.map((member) => (
              <Box
                key={member.email}
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
                      src={member.profilePic?.cloud_url}
                      height={"100%"}
                      width={"100%"}
                      alt="Member Profile"
                    />
                  </Box>
                  {member.email === userAuth.email ? "You" : member.fullName}
                </Box>
                {userAuth.email === groupChat.groupAdmin.email && (
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() =>
                      handleKickMember(groupChat._id, member.email)
                    }
                  >
                    Kick
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* Past Members Section */}
      {pastMembers?.length > 0 && (
        <>
          <Typography
            variant="h6"
            sx={{ marginTop: "1.5rem", fontWeight: "bold", color: "gray" }}
          >
            Past Members
          </Typography>
          <Box>
            {pastMembers?.map((pastMember) => (
              <Box
                key={pastMember._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  border: "1px solid gray",
                  margin: "0.5rem 0px",
                  padding: "0.5rem",
                  opacity: 0.6,
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
                      src={pastMember.profilePic?.cloud_url}
                      height={"100%"}
                      width={"100%"}
                      alt="Past Member Profile"
                    />
                  </Box>
                  {userAuth._id == pastMember._id ? "You" : pastMember.fullName}{" "}
                  <strong>(Removed)</strong>
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
    </div>
  );
}

export default Members;
