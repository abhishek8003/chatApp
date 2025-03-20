import React, { useContext, useEffect, useState } from "react";
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
import UserCardSkeleton from "./skeletions/UserCardSkeltion"; // Fixed typo in import
import { setUsers } from "../../../redux/features/users";
import toast from "react-hot-toast";
import { addFriends } from "../../../redux/features/friends";
import { changeDm } from "../../../redux/features/toggleDm";

function CreateDm() {
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [loadingUser, setLoadingUsers] = useState(true);
  const [addingFriends, setAddingFriends] = useState(false);

  const { users, friends, selectedUser, toggleDm, onlineUsers, userAuth } =
    useSelector((store) => ({
      users: store.users,
      friends: store.friends,
      selectedUser: store.selectedUser,
      toggleDm: store.toggleDm,
      onlineUsers: store.onlineUsers,
      userAuth: store.userAuth,
    }));

  const clientSocket = useContext(socketContext);
  const backendUrl = useContext(backendContext);
  const dispatch = useDispatch();

  const handleSelectingFriend = (friend) => {
    if (
      !selectedFriends.find((e) => e._id === friend._id) &&
      !friends.find((e) => e._id === friend._id)
    ) {
      setSelectedFriends((prev) => [...prev, friend]);
    } else {
      setSelectedValue(null);
      toast.error("Friend already selected");
    }
  };

  const handleRemoveFriends = (friendId) => {
    setSelectedFriends(selectedFriends.filter((f) => f._id !== friendId));
  };

  const handleAddFriends = async () => {
    if (selectedFriends.length > 0) {
      setAddingFriends(true);
      try {
        const response = await fetch(
          `${backendUrl}/api/users/${userAuth._id}/addFriends`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedFriends),
          }
        );
        const json = await response.json();
        if (response.status === 200) {
          clientSocket?.emit("sendFriend", {
            target: selectedFriends,
            newFriend: userAuth._id,
          });
          dispatch(addFriends(selectedFriends));
          setSelectedFriends([]);
          toast.success(json.message);
        } else {
          toast.error(json.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setAddingFriends(false);
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
  }, [clientSocket, dispatch]);

  return (
    <Modal
      open={toggleDm}
      onClose={() => dispatch(changeDm())}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(4px)", // Subtle backdrop blur
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark semi-transparent overlay
      }}
    >
      <Box
        sx={{
          width: { xs: "21.875rem", sm: "28.125rem", md: "43.75rem" }, // 350px, 450px, 700px
          height: "80vh",
          backgroundColor: "#fafafa", // Light gray
          borderRadius: "0.75rem", // 12px
          boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.2)", // Stronger shadow
          padding: "1.5rem", // 24px
          overflowY: "auto",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: "0.375rem" }, // 6px
          "&::-webkit-scrollbar-thumb": {
            background: "#bdbdbd", // Gray scrollbar thumb
            borderRadius: "0.5rem", // 8px
          },
          border: "none", // Removed #ccc border
        }}
      >
        {/* Header */}
        <Typography
          variant="h5"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#333", // Dark gray
            fontWeight: 600,
            fontSize: "1.5rem", // 24px
            mb: "1.5rem", // 24px
          }}
        >
          Add New DM
          <IconButton
            onClick={() => dispatch(changeDm())}
            sx={{
              color: "#757575", // Medium gray
              "&:hover": { color: "#d32f2f" }, // Red on hover
            }}
          >
            <CloseIcon sx={{ fontSize: "1.5rem" }} /> {/* 24px */}
          </IconButton>
        </Typography>

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
          sx={{ width: "100%", mb: "1.5rem" }} // 24px
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add a friend"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.5rem", // 8px
                  "& fieldset": { borderColor: "#e0e0e0" }, // Subtle gray
                  "&:hover fieldset": { borderColor: "#bdbdbd" }, // Darker gray
                  "&.Mui-focused fieldset": { borderColor: "#1976d2" }, // Blue when focused
                },
                "& .MuiInputLabel-root": { color: "#757575" }, // Medium gray
                "& .Mui-focused.MuiInputLabel-root": { color: "#1976d2" }, // Blue when focused
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
                    padding: "0.75rem", // 12px
                    mb: "0.75rem", // 12px
                    backgroundColor: "#ffffff", // White card
                    borderRadius: "0.5rem", // 8px
                    boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.05)", // Subtle shadow
                    "&:hover": { backgroundColor: "#f5f5f5" }, // Light gray hover
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      mr: "1rem", // 16px
                    }}
                  >
                    <img
                      src={user.profilePic.cloud_url}
                      alt="Profile"
                      style={{
                        width: "3rem", // 48px
                        height: "3rem", // 48px
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
                          width: "0.75rem", // 12px
                          height: "0.75rem", // 12px
                          borderRadius: "50%",
                          backgroundColor: "#388e3c", // Green
                          border: "2px solid #ffffff", // White border for contrast
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "0.75rem", // 12px
                          height: "0.75rem", // 12px
                          borderRadius: "50%",
                          backgroundColor: "#d32f2f", // Red
                          border: "2px solid #ffffff", // White border for contrast
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#333", // Dark gray
                        fontSize: "1rem", // 16px
                        fontWeight: 500,
                      }}
                    >
                      {user.fullName}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleRemoveFriends(user._id)}
                    sx={{
                      color: "#d32f2f", // Red
                      "&:hover": { color: "#b71c1c" }, // Darker red
                    }}
                  >
                    <CloseIcon sx={{ fontSize: "1.25rem" }} /> {/* 20px */}
                  </IconButton>
                </Box>
              ))
            ) : (
              <Typography
                sx={{
                  color: "#757575", // Medium gray
                  fontSize: "0.875rem", // 14px
                  textAlign: "center",
                  py: "1rem", // 16px
                }}
              >
                No friends selected yet
              </Typography>
            )}
            {selectedFriends.length > 0 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "1.5rem" }}>
                <Button
                  variant="contained"
                  sx={{
                    width: "100%",
                    maxWidth: "12.5rem", // 200px
                    bgcolor: "#388e3c", // Green
                    color: "#ffffff",
                    textTransform: "none",
                    padding: "0.5rem 1rem", // 8px 16px
                    fontSize: "0.875rem", // 14px
                    borderRadius: "0.5rem", // 8px
                    "&:hover": { bgcolor: "#2e7d32" }, // Darker green
                    "&:disabled": { bgcolor: "#757575" }, // Gray when disabled
                  }}
                  disabled={addingFriends}
                  onClick={handleAddFriends}
                >
                  {addingFriends ? "Please Wait" : "Add Friends"}
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {new Array(8).fill(null).map((_, index) => (
              <UserCardSkeleton key={index} />
            ))}
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default CreateDm;