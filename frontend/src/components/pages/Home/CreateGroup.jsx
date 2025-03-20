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
import { setSelectedUser } from "../../../redux/features/selectedUser";
import { socketContext } from "../../../SocketProvider";
import { backendContext } from "../../../BackendProvider";
import UserCardSkeltion from "./skeletions/UserCardSkeltion";
import { setUsers } from "../../../redux/features/users";
import toast from "react-hot-toast";
import { addFriends } from "../../../redux/features/friends";
import { changeDm } from "../../../redux/features/toggleDm";
import { changeGroupBox } from "../../../redux/features/toggleGroup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { addGroup } from "../../../redux/features/groups";

function CreateGroup() {
  let [groupImgPreview, setgroupImgPreview] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [loadingUser, setLoadingUsers] = useState(true);
  const [creatingGroup, setCreatingGroup] = useState(false);

  const users = useSelector((store) => store.users);
  const friends = useSelector((store) => store.friends);
  const selectedUser = useSelector((store) => store.selectedUser);
  const toggleGroup = useSelector((store) => store.toggleGroup);
  const onlineUsers = useSelector((store) => store.onlineUsers);
  const userAuth = useSelector((store) => store.userAuth);
  const clientSocket = useContext(socketContext);
  const backendUrl = useContext(backendContext);
  const dispatch = useDispatch();
  let groupImg = useRef("");

  const handleSelectingFriend = (friend) => {
    if (!selectedFriends.find((e) => e._id === friend._id)) {
      setSelectedFriends((prevSelectedFriends) => [
        ...prevSelectedFriends,
        friend,
      ]);
    } else {
      setSelectedValue(null);
      toast.error("Friend already selected");
    }
  };

  const handleRemoveFriends = (friendId) => {
    setSelectedFriends(selectedFriends.filter((f) => f._id !== friendId));
  };

  const handleCreateGroup = async () => {
    if (selectedFriends.length > 0) {
      setCreatingGroup(true);
      try {
        console.log(groupName);
        console.log(selectedFriends);
        console.log(groupImg.current.files[0]);
        let formData = new FormData();
        formData.append("groupName", groupName);
        formData.append("members", JSON.stringify(selectedFriends));
        if (groupImg.current.files.length > 0) {
          formData.append("groupImage", groupImg.current.files[0]);
        }
        let response = await fetch(`${backendUrl}/api/groups/${userAuth._id}`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        let json = await response.json();
        if (response.status === 200) {
          console.log(json.newGroup);
          dispatch(addGroup(json.newGroup));
          dispatch(changeGroupBox());
          toast.success(json.message);
          clientSocket?.emit("addedNewGroup", { newGroup: json.newGroup });
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setCreatingGroup(false);
      }
    }
  };

  const handleSelectUser = (user) => {
    dispatch(setSelectedUser(user));
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
      open={toggleGroup}
      onClose={() => dispatch(changeGroupBox())}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(4px)", // Standard blur for modals
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
      }}
    >
      <Box
        sx={{
          width: { xs: "20rem", sm: "25rem", md: "40rem" }, // Compact width
          maxHeight: "75vh", // Compact height
          backgroundColor: "#ffffff", // Clean white background
          borderRadius: "0.5rem", // Subtle rounded corners
          boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.2)", // Light shadow
          padding: "1.25rem", // Tight padding
          overflowY: "auto",
          scrollbarWidth: "none", // No scrollbar
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
            color: "#333", // Dark gray
            fontWeight: 600,
            fontSize: "1.25rem", // Small, bold header
            mb: "1rem", // Tight spacing
          }}
        >
          Create New Group
          <IconButton
            onClick={() => dispatch(changeGroupBox())}
            sx={{
              color: "#666", // Medium gray
              "&:hover": { color: "#e63946" }, // Red on hover
            }}
          >
            <CloseIcon sx={{ fontSize: "1.25rem" }} /> {/* Small icon */}
          </IconButton>
        </Typography>

        {/* Group Name Input */}
        <TextField
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          sx={{
            width: "100%",
            mb: "1rem", // Tight spacing
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.25rem", // Subtle rounding
              "& fieldset": { borderColor: "#e0e0e0" }, // Light gray border
              "&:hover fieldset": { borderColor: "#bdbdbd" }, // Darker gray on hover
              "&.Mui-focused fieldset": { borderColor: "#1976d2" }, // Blue on focus
            },
            "& .MuiInputLabel-root": { color: "#666" }, // Medium gray label
            "& .Mui-focused.MuiInputLabel-root": { color: "#1976d2" }, // Blue on focus
            "& .MuiInputBase-input": {
              fontSize: "0.875rem", // Small text
              padding: "0.5rem", // Compact padding
            },
          }}
        />

        {/* Group Image Upload */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "1rem", // Tight spacing
          }}
        >
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{
              borderColor: "#e0e0e0", // Light gray border
              color: "#666", // Medium gray text
              textTransform: "none",
              fontSize: "0.875rem", // Small text
              borderRadius: "0.25rem", // Subtle rounding
              padding: "0.375rem 1rem", // Compact padding
              "&:hover": {
                borderColor: "#bdbdbd", // Darker gray on hover
                backgroundColor: "#f5f5f5", // Light gray hover
              },
            }}
          >
            Upload Group Image
            <input
              type="file"
              ref={groupImg}
              onChange={() => {
                let fileReader = new FileReader();
                fileReader.addEventListener("loadend", (event) => {
                  console.log(event.target.result);
                  setgroupImgPreview(event.target.result);
                });
                fileReader.readAsDataURL(groupImg.current.files[0]);
              }}
              style={{ display: "none" }}
            />
          </Button>
          {groupImgPreview && (
            <img
              src={groupImgPreview}
              alt="Group Preview"
              style={{
                width: "3rem", // Small preview
                height: "3rem",
                borderRadius: "0.25rem", // Subtle rounding
                objectFit: "cover",
              }}
            />
          )}
        </Box>

        {/* Autocomplete */}
        <Autocomplete
          value={selectedValue}
          onChange={(event, value) => {
            if (value && users.includes(value)) {
              handleSelectingFriend(value);
              setSelectedValue(null);
            }
          }}
          options={users || []}
          getOptionLabel={(option) => option?.fullName || ""}
          sx={{ width: "100%", mb: "1rem" }} // Tight spacing
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add a Friend"
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
                  fontSize: "0.875rem", // Small text
                  padding: "0.5rem", // Compact padding
                },
              }}
            />
          )}
        />

        {/* Friend List or Skeleton */}
        {!loadingUser ? (
          <>
            {selectedFriends.length > 0 ? (
              selectedFriends.map((user) => (
                <Box
                  key={user._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem", // Compact padding
                    mb: "0.5rem", // Tight spacing
                    backgroundColor: "#ffffff", // White background
                    borderRadius: "0.25rem", // Subtle rounding
                    "&:hover": { backgroundColor: "#f5f5f5" }, // Light gray hover
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      mr: "0.75rem", // Small spacing
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
                    onClick={() => handleRemoveFriends(user._id)}
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
                No friends selected yet
              </Typography>
            )}
            {selectedFriends.length > 0 && (
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
                  disabled={creatingGroup}
                  onClick={handleCreateGroup}
                >
                  {creatingGroup ? "Please Wait" : "Create Group"}
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
export default CreateGroup;