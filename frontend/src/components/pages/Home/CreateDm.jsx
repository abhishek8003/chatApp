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
import UserCardSkeltion from "./skeletions/UserCardSkeltion";
import { setUsers } from "../../../redux/features/users";
import toast from "react-hot-toast";
import { addFriends } from "../../../redux/features/friends";
import { changeDm } from "../../../redux/features/toggleDm";

function CreateDm() {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [loadingUser, setLoadingUsers] = useState(true);
  const users = useSelector((store) => store.users);
  const friends = useSelector((store) => store.friends);
  const selectedUser = useSelector((store) => store.selectedUser);
  const toggleDm = useSelector((store) => store.toggleDm);
  const onlineUsers = useSelector((store) => store.onlineUsers);
  const userAuth = useSelector((store) => store.userAuth); // Assuming userAuth is stored in Redux
  let [addingFriends, setaddingFriends] = useState(false);

  const clientSocket = useContext(socketContext);
  const backendUrl = useContext(backendContext);
  const dispatch = useDispatch();

  const handleSelectingFriend = (friend) => {
    if (
      !selectedFriends.find((e) => {
        if (e._id == friend._id) return true;
      }) &&
      !friends.find((e) => {
        if (e._id == friend._id) return true;
      })
    ) {
      setSelectedFriends((prevSelectedFriends) => [
        ...prevSelectedFriends,
        friend,
      ]);
    } else {
      toast.error("Friend already selected");
    }
  };

  const handleRemoveFriends = (friendId) => {
    setSelectedFriends(selectedFriends.filter((f) => f._id !== friendId));
  };

  const handleAddFriends = async () => {
    if (selectedFriends.length > 0) {
      setaddingFriends(true);
      try {
        const response = await fetch(
          `${backendUrl}/api/users/${userAuth._id}/addFriends`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedFriends),
          }
        );
        clientSocket.emit("sendFriend", {target:selectedFriends,newFriend:userAuth._id});
        const json = await response.json();
        if (response.status === 200) {
          dispatch(addFriends(selectedFriends));
          setSelectedFriends([]);
          toast.success(json.message);
        } else {
          toast.error(json.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setaddingFriends(false);
      }
    }
  };

  const handleSelectUser = (user) => {
    dispatch(setSelectedUser(user));
  };

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        clientSocket.emit("fetchAllUsers");
        clientSocket.on("getAllUsersExceptMe", (users) => {
          dispatch(setUsers(users));
        });
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadingUsers(false);
      }
    };
    getAllUsers();

    return () => {
      clientSocket.off("getAllUsersExceptMe");
    };
  }, [clientSocket]);

  return (
    <Modal
      open={toggleDm}
      onClose={() => dispatch(changeDm())}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Box
        sx={{
          height: "80%",
          width: { xs: "350px", sm: "450px", md: "700px" },
          border: "2px solid #ccc",
          borderRadius: "8px",
          overflow: "auto",
          scrollbarWidth: "thin",
          backgroundColor: "background.paper",
          p: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          Add new DM!
          <IconButton onClick={() => dispatch(changeDm(0))}>
            <CloseIcon />
          </IconButton>
        </Typography>
        <Autocomplete
          onChange={(event, value) => {
            if (users.includes(value)) {
              handleSelectingFriend(value);
            }
          }}
          options={users || []}
          getOptionLabel={(option) => option?.fullName || ""}
          sx={{ width: "100%", mb: 2 }}
          renderInput={(params) => (
            <TextField {...params} label="Add a friend" />
          )}
        />
        {!loadingUser ? (
          <>
            {selectedFriends && selectedFriends.length > 0
              ? selectedFriends.map((user) => (
                  <Box
                    key={user._id}
                    sx={{
                      display: "flex",
                      height: "70px",
                      alignItems: "center",
                      cursor: "pointer",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        position: "relative",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={user.profilePic.cloud_url}
                        alt="Profile"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        flexGrow: "1",
                        display: "flex",
                        flexDirection: "column",
                        wordBreak: "break-all",
                        ml: 2,
                      }}
                    >
                      <Typography variant="body1">{user.fullName}</Typography>
                      {onlineUsers &&
                      onlineUsers.find((e) => e._id === user._id) ? (
                        <Typography
                          variant="subtitle2"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "green",
                              marginRight: "5px",
                            }}
                          ></span>
                          Online
                        </Typography>
                      ) : (
                        <Typography
                          variant="subtitle2"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "red",
                              marginRight: "5px",
                            }}
                          ></span>
                          Offline
                        </Typography>
                      )}
                    </Box>
                    <IconButton
                      onClick={() => handleRemoveFriends(user._id)}
                      sx={{ color: "red" }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))
              : null}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                sx={{ width: "30%" }}
                variant="contained"
                onClick={handleAddFriends}
                disabled={addingFriends}
              >
                {addingFriends ? "Please wait" : "Add friends"}
              </Button>
            </Box>
          </>
        ) : (
          <>
            {new Array(8).fill(null).map((_, index) => (
              <UserCardSkeltion key={index} />
            ))}
          </>
        )}
      </Box>
    </Modal>
  );
}

export default CreateDm;
