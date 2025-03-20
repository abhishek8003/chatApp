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
  let currentMembers = useSelector((store) => store.groupCurrentMembers);
  let pastMembers = useSelector((store) => store.groupPastMembers);
  let dispatch = useDispatch();
  let [newMembers, setNewMembers] = useState([]);

  const handleKickMember = async (groupId, memberEmail) => {
    try {
      let targetMember = users.find((e) => e.email === memberEmail) || {
        _id: userAuth._id,
        email: userAuth.email,
      };
      let memberId = targetMember._id;

      clientSocket?.emit("memberKick", { groupId, memberEmail });

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
        padding: "1rem 0.5rem", // 16px
        display: "flex",
        flexDirection: "column",
        gap: "1rem", // 16px
        height: "100%",
        overflow: "auto",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { width: "0.375rem" }, // 6px
        "&::-webkit-scrollbar-thumb": {
          background: "#bdbdbd", // Gray scrollbar thumb
          borderRadius: "0.5rem", // 8px
        },
      }}
    >
      {/* Group Title */}
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
          Members ({currentMembers.length + 1})
        </Typography>
      </Box>

      {/* Add Members Button (Admin Only) */}
      {groupChat?.groupAdmin?._id === userAuth._id && (
        <Box>
          <Button
            variant="outlined"
            startIcon={<PersonAddIcon />}
            sx={{
              textTransform: "none",
              width: "100%",
              borderColor: "#e0e0e0", // Subtle border
              color: "#333", // Dark gray
              borderRadius: "0.5rem", // 8px
              padding: "0.5rem 1rem", // 8px 16px
              "&:hover": {
                backgroundColor: "#f5f5f5", // Light gray hover
                borderColor: "#bdbdbd", // Slightly darker border
              },
            }}
            onClick={() => {
              dispatch(setaddGroupMemberToggle());
            }}
          >
            Add Members
          </Button>
          <AddGroupMembers />
        </Box>
      )}

      {/* Admin Section */}
      {groupChat?.groupAdmin?._id && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "0.0625rem solid #e0e0e0", // 1px subtle border
            borderRadius: "0.5rem", // 8px
            padding: "0.5rem", // 8px
            backgroundColor: "#fff", // White background
            transition: "background 0.2s ease",
            "&:hover": {
              backgroundColor: "#f5f5f5", // Light gray hover
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Box
              sx={{
                height: "2.5rem", // 40px
                width: "2.5rem", // 40px
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "0.0625rem solid #e0e0e0", // 1px subtle border
                boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.05)", // 2px 4px
              }}
            >
              <img
                src={groupChat?.groupAdmin?.profilePic?.cloud_url}
                alt="Admin Profile"
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
              />
            </Box>
            <Typography
              sx={{ color: "#333", fontSize: "0.875rem" }} // 14px
            >
              {groupChat?.groupAdmin?._id === userAuth._id
                ? "You"
                : groupChat.groupAdmin.fullName}{" "}
              <strong>(Admin)</strong>
            </Typography>
          </Box>
        </Box>
      )}

      {/* Current Members Section */}
      {currentMembers.length > 0 && (
        <>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "500",
              color: "#333", // Dark gray
              fontSize: "1rem", // 16px
              marginTop: "0.5rem", // 8px
            }}
          >
            Current Members
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {currentMembers.map((member) => (
              <Box
                key={member.email}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "0.0625rem solid #e0e0e0", // 1px subtle border
                  borderRadius: "0.5rem", // 8px
                  padding: "0.5rem", // 8px
                  backgroundColor: "#fff", // White background
                  transition: "background 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#f5f5f5", // Light gray hover
                  },
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Box
                    sx={{
                      height: "2.5rem", // 40px
                      width: "2.5rem", // 40px
                      borderRadius: "50%",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "0.0625rem solid #e0e0e0", // 1px subtle border
                      boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.05)", // 2px 4px
                    }}
                  >
                    <img
                      src={member.profilePic?.cloud_url}
                      alt="Member Profile"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{ color: "#333", fontSize: "0.875rem" }} // 14px
                  >
                    {member.email === userAuth.email ? "You" : member.fullName}
                  </Typography>
                </Box>
                {userAuth.email === groupChat.groupAdmin.email && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{
                      textTransform: "none",
                      borderRadius: "0.5rem", // 8px
                      padding: "0.25rem 0.75rem", // 4px 12px
                      fontSize: "0.75rem", // 12px
                      "&:hover": {
                        backgroundColor: "#ffebee", // Light red hover
                      },
                    }}
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
            sx={{
              fontWeight: "500",
              color: "#757575", // Medium gray
              fontSize: "1rem", // 16px
              marginTop: "1rem", // 16px
            }}
          >
            Past Members
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {pastMembers.map((pastMember) => (
              <Box
                key={pastMember._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "0.0625rem solid #e0e0e0", // 1px subtle border
                  borderRadius: "0.5rem", // 8px
                  padding: "0.5rem", // 8px
                  backgroundColor: "#fff", // White background
                  opacity: 0.7, // Slightly faded
                  transition: "background 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#f5f5f5", // Light gray hover
                  },
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Box
                    sx={{
                      height: "2.5rem", // 40px
                      width: "2.5rem", // 40px
                      borderRadius: "50%",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "0.0625rem solid #e0e0e0", // 1px subtle border
                      boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.05)", // 2px 4px
                    }}
                  >
                    <img
                      src={pastMember.profilePic?.cloud_url}
                      alt="Past Member Profile"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{ color: "#333", fontSize: "0.875rem" }} // 14px
                  >
                    {userAuth._id === pastMember._id
                      ? "You"
                      : pastMember.fullName}{" "}
                    <strong>(Removed)</strong>
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

export default Members;