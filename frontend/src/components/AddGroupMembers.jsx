import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Autocomplete,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
// import { setSelectedUser } from "../../../redux/features/selectedUser";
import UserCardSkeltion from "../components/pages/Home/skeletions/UserCardSkeltion";
import toast from "react-hot-toast";
// import { addFriends } from "../../../redux/features/friends";
// import { changeGroupBox } from "../../../redux/features/toggleGroup";
// import { addGroup } from "../../../redux/features/groups";
import { setaddGroupMemberToggle } from "../redux/features/addGroupMemberToggle";
import { socketContext } from "../SocketProvider";
import { backendContext } from "../BackendProvider";
import { setUsers } from "../redux/features/users";
import {
  addgroupCurrentMembers,
  removegroupCurrentMembers,
} from "../redux/features/groupCurrentMembers";
import {
  addgroupPastMembers,
  removegroupPastMembers,
} from "../redux/features/groupPastMembers";
import {
  addMemberInGroups,
  removeMemberFromGroups,
} from "../redux/features/groups";
import {
  addMemberInGroupChat,
  removeMemberFromGroupChat,
} from "../redux/features/groupChats";
import {
  addMemberInSelectedGroup,
  removeMemberFromSelectedGroup,
} from "../redux/features/selectedGroup";

function AddGroupMembers() {
  let [groupImgPreview, setgroupImgPreview] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loadingUser, setLoadingUsers] = useState(true);
  const [addingGroupMembers, setAddingGroupMembers] = useState(false);

  const users = useSelector((store) => store.users);
  const newGroupMembers = useSelector((store) => store.newGroupMembers);
  const selectedUser = useSelector((store) => store.selectedUser);
  const addGroupMemberToggle = useSelector(
    (store) => store.addGroupMemberToggle
  );
  const onlineUsers = useSelector((store) => store.onlineUsers);
  const userAuth = useSelector((store) => store.userAuth);
  let groupCurrentMembers = useSelector((store) => store.groupCurrentMembers);
  let groupPastMembers = useSelector((store) => store.groupPastMembers);
  const clientSocket = useContext(socketContext);
  const backendUrl = useContext(backendContext);
  const dispatch = useDispatch();
  let selectedGroup = useSelector((store) => store.selectedGroup);
  let groups = useSelector((store) => store.groups);

  const handleSelectingNewMembers = (newMember) => {
    if (
      !selectedMembers.find((e) => e._id === newMember._id) &&
      !groupCurrentMembers.find((e) => e._id === newMember._id)
    ) {
      setSelectedMembers((prev) => [...prev, newMember]);
    } else if (selectedMembers.find((e) => e._id === newMember._id)) {
      setSelectedValue(null);
      toast.error("Member already selected");
    } else {
      setSelectedValue(null);
      toast.error("Member already in this group!");
    }
  };

  const handleRemoveSelectingMembers = (memberId) => {
    setSelectedMembers(selectedMembers.filter((m) => m._id !== memberId));
  };

  const handleAddGroupMembers = async () => {
    if (selectedMembers.length > 0) {
      setAddingGroupMembers(true);
      try {
        clientSocket?.emit("memberAdd", {
          groupId: selectedGroup._id,
          members: selectedMembers,
        });

        const response = await fetch(
          `${backendUrl}/api/groups/${selectedGroup._id}/addMembers`,
          {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedMembers),
          }
        );
        const data = await response.json();
        if (response.status === 200) {
          toast.success(data.message);
          selectedMembers.forEach((m) => {
            dispatch(addMemberInGroups({ groupId: selectedGroup._id, member: m }));
            dispatch(addMemberInGroupChat({ groupId: selectedGroup._id, member: m }));
            dispatch(addMemberInSelectedGroup({ groupId: selectedGroup._id, member: m }));
            dispatch(addgroupCurrentMembers(m));
            dispatch(removegroupPastMembers(m));
          });
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
        console.error(error);
      } finally {
        setAddingGroupMembers(false);
        setSelectedMembers([]);
        setSelectedValue(null);
      }
    }
  };

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        clientSocket?.emit("fetchAllUsers");
        clientSocket?.on("getAllUsersExceptMe", (users) => {
          dispatch(setUsers(users));
          setLoadingUsers(false);
        });
      } catch (error) {
        toast.error(error.message);
        setLoadingUsers(false);
      }
    };
    getAllUsers();

    return () => {
      clientSocket?.off("getAllUsersExceptMe");
    };
  }, [clientSocket]);

  return (
    <Modal
      open={addGroupMemberToggle}
      onClose={() => dispatch(setaddGroupMemberToggle())}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(4px)", // Standard blur for modals in chat apps
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
      }}
    >
      <Box
        sx={{
          width: { xs: "20rem", sm: "25rem", md: "40rem" }, // Slightly smaller for a compact feel
          maxHeight: "75vh", // Compact height for a DM modal
          backgroundColor: "#ffffff", // Clean white background
          borderRadius: "0.5rem", // Subtle rounded corners
          boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.2)", // Light shadow for depth
          padding: "1.25rem", // Tight padding for a minimal look
          overflowY: "auto",
          scrollbarWidth: "none", // No scrollbar for a clean look
          "&::-webkit-scrollbar": { display: "none" },
          border: "none",
        }}
      >
        {/* Header */}
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#333", // Dark gray for contrast
            fontWeight: 600,
            fontSize: "1.25rem", // Small, bold header
            mb: "1rem", // Tight spacing below
          }}
        >
          Add Group Members
          <IconButton
            onClick={() => dispatch(setaddGroupMemberToggle())}
            sx={{
              color: "#666", // Medium gray
              "&:hover": { color: "#e63946" }, // Red on hover
            }}
          >
            <CloseIcon sx={{ fontSize: "1.25rem" }} /> {/* Small close icon */}
          </IconButton>
        </Typography>

        {/* Autocomplete */}
        <Autocomplete
          value={selectedValue}
          onChange={(event, value) => {
            if (value && users.includes(value)) {
              handleSelectingNewMembers(value);
              setSelectedValue(null);
            }
          }}
          options={users || []}
          getOptionLabel={(option) => option?.fullName || ""}
          sx={{ width: "100%", mb: "1rem" }} // Tight spacing below
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add a Member"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.25rem", // Subtle rounding
                  "& fieldset": { borderColor: "#e0e0e0" }, // Light gray border
                  "&:hover fieldset": { borderColor: "#bdbdbd" }, // Darker gray on hover
                  "&.Mui-focused fieldset": { borderColor: "#1976d2" }, // Blue on focus
                },
                "& .MuiInputLabel-root": { color: "#666" }, // Medium gray label
                "& .Mui-focused.MuiInputLabel-root": { color: "#1976d2" }, // Blue on focus
                "& .MuiInputBase-input": {
                  fontSize: "0.875rem", // Small, clean text
                  padding: "0.5rem", // Compact padding
                },
              }}
            />
          )}
        />

        {/* Member List or Skeleton */}
        {!loadingUser ? (
          <>
            {selectedMembers.length > 0 ? (
              selectedMembers.map((user) => (
                <Box
                  key={user._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem", // Compact padding
                    mb: "0.5rem", // Tight spacing between cards
                    backgroundColor: "#ffffff", // White background
                    borderRadius: "0.25rem", // Subtle rounding
                    "&:hover": { backgroundColor: "#f5f5f5" }, // Light gray hover
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      mr: "0.75rem", // Small spacing from image
                    }}
                  >
                    <img
                      src={user.profilePic.cloud_url}
                      alt="Profile"
                      style={{
                        width: "2.25rem", // Small avatar
                        height: "2.25rem",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    {onlineUsers.find((e) => e._id === user._id) ? (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "0.625rem", // Small status dot
                          height: "0.625rem",
                          borderRadius: "50%",
                          backgroundColor: "#2ecc71", // Green for online
                          border: "2px solid #ffffff", // White border
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "0.625rem",
                          height: "0.625rem",
                          borderRadius: "50%",
                          backgroundColor: "#e63946", // Red for offline
                          border: "2px solid #ffffff",
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#333", // Dark gray text
                        fontSize: "0.875rem", // Small text
                        fontWeight: 500,
                      }}
                    >
                      {user.fullName}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleRemoveSelectingMembers(user._id)}
                    sx={{
                      color: "#e63946", // Red for remove
                      "&:hover": { color: "#d00000" }, // Darker red on hover
                    }}
                  >
                    <CloseIcon sx={{ fontSize: "1rem" }} /> {/* Small icon */}
                  </IconButton>
                </Box>
              ))
            ) : (
              <Typography
                sx={{
                  color: "#666", // Medium gray
                  fontSize: "0.875rem", // Small text
                  textAlign: "center",
                  py: "1rem", // Moderate padding
                }}
              >
                No members selected yet
              </Typography>
            )}
            {selectedMembers.length > 0 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "1rem" }}>
                <Button
                  variant="contained"
                  sx={{
                    width: "100%",
                    maxWidth: "10rem", // Compact button
                    bgcolor: "#1976d2", // Standard MUI blue
                    color: "#ffffff",
                    textTransform: "none",
                    padding: "0.375rem 1rem", // Compact padding
                    fontSize: "0.875rem", // Small text
                    borderRadius: "0.25rem", // Subtle rounding
                    "&:hover": { bgcolor: "#1565c0" }, // Darker blue on hover
                    "&:disabled": { bgcolor: "#bdbdbd" }, // Gray when disabled
                  }}
                  disabled={addingGroupMembers}
                  onClick={handleAddGroupMembers}
                >
                  {addingGroupMembers ? "Please Wait" : "Add Members"}
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {new Array(8).fill(null).map((_, index) => (
              <UserCardSkeltion key={index} />
            ))}
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default AddGroupMembers;