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
  const users = useSelector((store) => store.users);
  const friends = useSelector((store) => store.friends);
  const selectedUser = useSelector((store) => store.selectedUser);
  const toggleGroup = useSelector((store) => store.toggleGroup);
  const onlineUsers = useSelector((store) => store.onlineUsers);
  const userAuth = useSelector((store) => store.userAuth); // Assuming userAuth is stored in Redux
  let [creatingGroup, setCreatingGroup] = useState(false);

  const clientSocket = useContext(socketContext);
  const backendUrl = useContext(backendContext);
  const dispatch = useDispatch();
  let groupImg = useRef("");

  const handleSelectingFriend = (friend) => {
    if (
      !selectedFriends.find((e) => {
        if (e._id == friend._id) return true;
      })
    ) {
      setSelectedFriends((prevSelectedFriends) => [
        ...prevSelectedFriends,
        friend,
      ]);
    } else {
      setSelectedValue("");
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
        let response=await fetch(`${backendUrl}/api/groups/${userAuth._id}`,{
          method:"POST",
          credentials:"include",
          body:formData
        });
        let json=await response.json();
        if(response.status===200){
          console.log(json.newGroup);
          dispatch(addGroup(json.newGroup));
          dispatch(changeGroupBox());
          toast.success(json.message);
          clientSocket?.emit("addedNewGroup",{newGroup:json.newGroup})
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
      open={toggleGroup}
      onClose={() => dispatch(changeGroupBox())}
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
          <IconButton onClick={() => dispatch(changeGroupBox())}>
            <CloseIcon />
          </IconButton>
        </Typography>
        <TextField
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          sx={{ width: "100%", marginBottom: "8px" }}
        />
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            margin: "4px 0px",
          }}
        >
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ margin: "auto" }}
          >
            Upload group image
            <input
              type="file"
              ref={groupImg}
              onChange={()=>{
                let fileReader=new FileReader();
                fileReader.addEventListener("loadend",(event)=>{
                  console.log(event.target.result);
                  setgroupImgPreview(event.target.result);
                });
                fileReader.readAsDataURL(groupImg.current.files[0]);
              }}
              style={{ display: "none" }}
            ></input>
          </Button>
          <img
            src={groupImgPreview}
            height={"100px"} width={"100px"}
            style={{ display: groupImgPreview ? "inline-block" : "none" }}
          ></img>
        </Box>
        <Autocomplete
          value={selectedValue}
          onChange={(event, value) => {
            if (users.includes(value)) {
              handleSelectingFriend(value);
              setSelectedValue("");
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
                sx={{ width: "30%", minWidth: "200px" }}
                variant="contained"
                onClick={handleCreateGroup}
                disabled={creatingGroup}
              >
                {creatingGroup ? "Please wait" : "Create New Group"}
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

export default CreateGroup;
