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
import { addMemberInGroups, removeMemberFromGroups } from "../redux/features/groups";
import { addMemberInGroupChat, removeMemberFromGroupChat } from "../redux/features/groupChats";
import { addMemberInSelectedGroup, removeMemberFromSelectedGroup } from "../redux/features/selectedGroup";

function AddGroupMembers() {
  let [groupImgPreview, setgroupImgPreview] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [loadingUser, setLoadingUsers] = useState(true);
  const users = useSelector((store) => store.users);
  const newGroupMembers = useSelector((store) => store.newGroupMembers);
  const selectedUser = useSelector((store) => store.selectedUser);
  const addGroupMemberToggle = useSelector(
    (store) => store.addGroupMemberToggle
  );
  const onlineUsers = useSelector((store) => store.onlineUsers);
  const userAuth = useSelector((store) => store.userAuth); // Assuming userAuth is stored in Redux
  let [addingGroupMembers, setaddingGroupMembers] = useState(false); //just for progress
  let groupCurrentMembers = useSelector((store) => store.groupCurrentMembers);
  let groupPastMembers = useSelector((store) => store.groupPastMembers);
  const clientSocket = useContext(socketContext);
  const backendUrl = useContext(backendContext);
  const dispatch = useDispatch();
  let selectedGroup = useSelector((store) => {
    return store.selectedGroup;
  });
  let groups=useSelector((store)=>store.groups)
  const handleSelectingNewMembers = (newMember) => {
    if (
      !selectedMembers.find((e) => {
        if (e._id == newMember._id) return true;
      }) &&
      !groupCurrentMembers.find((e) => {
        if (e._id == newMember._id) return true;
      })
    ) {
      setSelectedMembers((prevSelectedFriends) => [
        ...prevSelectedFriends,
        newMember,
      ]);
    } else if (
      selectedMembers.find((e) => {
        if (e._id == newMember._id) return true;
      })
    ) {
      setSelectedValue("");
      toast.error("Friend already selected ");
    } else if (
      groupCurrentMembers.find((e) => {
        if (e._id == newMember._id) return true;
      })
    ) {
      setSelectedValue("");
      toast.error("Friend already a member of this group! ");
    }
  };

  const handleRemoveSelectingMembers = (friendId) => {
    setSelectedMembers(selectedMembers.filter((f) => f._id !== friendId));
  };

  const handleAddGroupMembers = async (selectedMembers) => {
    if (selectedMembers.length > 0) {
      setaddingGroupMembers(true);
      try {
        console.log("Members to be added:", selectedMembers);

        clientSocket?.emit("memberAdd", { groupId:selectedGroup._id, members:selectedMembers });

        const response = await fetch(
          `${backendUrl}/api/groups/${selectedGroup._id}/addMembers`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json", // Add this header
            },
            body: JSON.stringify(selectedMembers),
          }
        );
        
        const data = await response.json();
        if (response.status === 200) {
          toast.success(data.message);
          console.log("UPDATED GROUP WITH NEW MEMBERS",data.group);
          console.log("GRoups:",groups);
          
          selectedMembers.forEach((m) => {
            dispatch(
              addMemberInGroups({
                groupId: selectedGroup._id,
                member:m
              })
            ); //we just sending group ID and member
            dispatch(
              addMemberInGroupChat({
                groupId: selectedGroup._id,
                member:m
              })
            ); //we just sending group ID and member
            dispatch(
              addMemberInSelectedGroup({
                groupId: selectedGroup._id,
                member:m
              })
            ); ////we just sending group ID and member
          });

          dispatch(addgroupCurrentMembers(selectedMembers));
          dispatch(removegroupPastMembers(selectedMembers));
        } else {
          console.log(data.message);
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setaddingGroupMembers(false);
        setSelectedMembers([]);
        setSelectedValue("");
      }
    }
  };

  // const handleSelectUser = (user) => {
  //   dispatch(setSelectedUser(user));
  // };
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        clientSocket?.emit("fetchAllUsers");
        clientSocket?.on("getAllUsersExceptMe", (users) => {
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
      clientSocket?.off("getAllUsersExceptMe");
    };
  }, [clientSocket]);

  return (
    <Modal
      open={addGroupMemberToggle}
      onClose={() => dispatch(setaddGroupMemberToggle())}
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
          Add Group members!
          <IconButton onClick={() => dispatch(setaddGroupMemberToggle())}>
            <CloseIcon />
          </IconButton>
        </Typography>
        <Autocomplete
          value={selectedValue}
          onChange={(event, value) => {
            if (users.includes(value)) {
              handleSelectingNewMembers(value);
              setSelectedValue("");
            }
          }}
          options={users || []}
          getOptionLabel={(option) => option?.fullName || ""}
          sx={{ width: "100%", mb: 2 }}
          renderInput={(params) => (
            <TextField {...params} label="Add a Member" />
          )}
        />
        {!loadingUser ? (
          <>
            {selectedMembers && selectedMembers.length > 0
              ? selectedMembers.map((user) => (
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
                      onClick={() => handleRemoveSelectingMembers(user._id)}
                      sx={{ color: "red" }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))
              : null}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                sx={{ width: "30%", minWidth: "200px" }}
                variant="contained"
                onClick={() => {
                  handleAddGroupMembers(selectedMembers);
                }}
                disabled={addingGroupMembers}
              >
                {addingGroupMembers ? "Please wait" : "Add Members"}
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

export default AddGroupMembers;
