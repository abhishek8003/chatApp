import {
  Avatar,
  Box,
  CircularProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import React, { useContext, useEffect, useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setUsers } from "../../../redux/features/users";
import { setSelectedUser } from "../../../redux/features/selectedUser";
import UserCardSkeltion from "./skeletions/UserCardSkeltion";
import { socketContext } from "../../../SocketProvider";
import { setOnlineUsers } from "../../../redux/features/onlineUsers";
import BackendProvider, { backendContext } from "../../../BackendProvider";
import CreateDm from "./CreateDm";
import { addFriends, intializeFriends } from "../../../redux/features/friends";
import { changeDm } from "../../../redux/features/toggleDm";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { changeGroupBox } from "../../../redux/features/toggleGroup";
import CreateGroup from "./CreateGroup";
import store from "../../../redux/store";
import { setSelectedGroup } from "../../../redux/features/selectedGroup";
import { intializeGroups, setGroups } from "../../../redux/features/groups";
import {
  deleteNotificationOfGroup,
  deleteNotificationOfUser,
} from "../../../redux/features/notifications";
import { setGroupChat } from "../../../redux/features/groupChats";

function Sidebar() {
  let [loadingUserFriends, setloadingUserFriends] = useState(true);
  let [loadingUserGroups, setloadingUserGroups] = useState(true);
  let friends = useSelector((store) => store.friends);
  let userAuth = useSelector((store) => store.userAuth);
  let users = useSelector((store) => store.users);
  let selectedUser = useSelector((store) => store.selectedUser);
  let notifications = useSelector((store) => store.notification);
  let clientSocket = useContext(socketContext);
  let backendUrl = useContext(backendContext);
  let handleSelectUser = async (user) => {
    console.log(userAuth);
    dispatch(deleteNotificationOfUser(user));
    let targetUserNotifications = notifications.filter((e) => {
      if (e.senderId == user._id && e.recieverId == userAuth._id) {
        return true;
      }
      return false;
    });
    console.log("targetUserNotifications:", targetUserNotifications);

    let response = fetch(`${backendUrl}/api/notifications/`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...targetUserNotifications[0],image:""}),
    })
      .then((result) => {
        console.log("notification for current target chat wiped successfully!");
      })
      .catch((err) => {
        toast.error(err.message);
      });
    dispatch(setSelectedUser(null));
    dispatch(setSelectedGroup(null));
    console.log("selecting a user", user);
    dispatch(setSelectedUser(user));
  };
  let handleSelectGroup = (group) => {
    dispatch(deleteNotificationOfGroup(group));
    let targetGroupNotifications = notifications.filter((e) => {
      if (e.receiverId == group._id) {
        return true;
      }
      return false;
    });
    console.log("targetGroupNotifications:", targetGroupNotifications);
    let response = fetch(`${backendUrl}/api/notifications/`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...targetGroupNotifications[0],image:""}),
    })
      .then((result) => {
        console.log("notification for current target grouped wiped successfully!");
      })
      .catch((err) => {
        toast.error(err.message);
      });
    dispatch(setSelectedUser(null));
    dispatch(setSelectedGroup(null));
    console.log("selecting a group", group);
    dispatch(setSelectedGroup(group));
  };

  let onlineUsers = useSelector((store) => store.onlineUsers);
  let dispatch = useDispatch();
  let toggleDm = useSelector((store) => store.toggleDm);
  let selectedGroup = useSelector((store) => store.selectedGroup);
  useEffect(() => {
    let getAllFriends = async () => {
      dispatch(intializeFriends([]));
      try {
        console.log("fetching friends.....");
        let response = await fetch(
          `${backendUrl}/api/users/${userAuth._id}/friends`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        let json = await response.json();
        if (response.status === 200) {
          console.log("current friends:", json);
          console.log(json.friends);
          dispatch(addFriends(json.friends));
        } else {
          toast.error(json.message);
        }
        clientSocket?.emit("fetchAllUsers");
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      } finally {
        setloadingUserFriends(false);
      }
    };
    let getAllGroups = async () => {
      console.log("fetching groups.....");
      dispatch(intializeGroups([]));
      try {
        let response = await fetch(`${backendUrl}/api/groups/${userAuth._id}`, {
          method: "GET",
          credentials: "include",
        });
        let json = await response.json();
        if (response.status === 200) {
          console.log("current groups:", json.allGroups);
          dispatch(setGroups(json.allGroups));
        } else {
          toast.error(json.message);
        }
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      } finally {
        setloadingUserGroups(false);
      }
    };
    getAllFriends();
    getAllGroups();
    return () => {
      console.log("sidebar unmounted");
    };
  }, [clientSocket]);
  let groups = useSelector((store) => store.groups);

  return (
    <Box
      sx={{
        gap: "0.5rem", // 8px
        height: "80vh",
        overflow: "auto",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { width: "0.5rem" }, // 8px
        "&::-webkit-scrollbar-thumb": {
          background: "#bdbdbd", // Subtle gray scrollbar
          borderRadius: "1rem", // 16px
        },
        backgroundColor: "#f5f7fa", // Light gray background
        borderRight: "1px solid #e0e0e0", // Subtle border on the right
        padding: "0.5rem", // 8px
        "@media (min-width:0px) and (max-width:633px)": {
          minWidth: "5.3125rem", // 85px
          maxWidth: "5.375rem", // 86px
        },
        "@media (min-width:634px) and (max-width:740px)": {
          minWidth: "12.5rem", // 200px
          maxWidth: "12.5625rem", // 201px
        },
        "@media (min-width:741px) and (max-width:850px)": {
          minWidth: "15.4375rem", // 247px
          maxWidth: "15.5rem", // 248px
        },
        "@media (min-width:851px)": {
          minWidth: "21.875rem", // 350px
          maxWidth: "21.9375rem", // 351px
        },
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem", // 8px
          padding: "0.75rem", // 12px
          height: "3.5rem", // 56px
          marginBottom: "0.5rem", // 8px
          backgroundColor: "#ffffff", // White background
          borderBottom: "1px solid #e0e0e0", // Subtle border
        }}
      >
        <Typography
          variant="h6"
          className="people_img"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#1976d2", // Professional blue
          }}
        >
          <PeopleIcon sx={{ fontSize: "2rem" }} /> {/* Slightly smaller icon */}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#333", // Dark gray for professionalism
            fontWeight: "600",
            fontSize: "1.25rem", // 20px
            "@media (max-width:633px)": {
              display: "none",
            },
          }}
        >
          Contacts
        </Typography>
      </div>

      {/* No Friends/Groups Message */}
      {groups.length === 0 &&
      !loadingUserGroups &&
      !loadingUserFriends &&
      friends.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
            padding: "1rem", // 16px
            fontSize: "0.875rem", // 14px
            color: "#666", // Muted gray
            fontStyle: "italic",
            "@media (min-width:1px) and (max-width:633px)": {
              display: "none",
            },
          }}
        >
          No groups or friends yet. Start connecting!
        </Typography>
      ) : null}

      {/* Groups */}
      {!loadingUserGroups ? (
        <>
          {groups.map((group) => (
            <div
              key={group._id}
              className="people_cont"
              style={{
                display: "flex",
                height: "3.5rem", // 56px, slightly smaller for a tighter layout
                alignItems: "center",
                backgroundColor:
                  selectedGroup && selectedGroup._id === group._id
                    ? "#e3f2fd" // Light blue for selected state
                    : "#ffffff", // White background
                borderRadius: "0.5rem", // 8px
                marginBottom: "0.5rem", // 8px
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f1f5f9", // Subtle hover effect
                },
              }}
              onClick={() => handleSelectGroup(group)}
            >
              <Typography
                variant="h6"
                className="people_img"
                sx={{
                  display: "flex",
                  position: "relative",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0.25rem", // 4px
                }}
              >
                <img
                  src={group.groupIcon.cloud_url}
                  alt="Group"
                  style={{
                    width: "2.25rem", // 36px, slightly smaller
                    height: "2.25rem", // 36px
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #e0e0e0", // Subtle border
                  }}
                />
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  wordBreak: "break-all",
                  padding: "0.5rem", // 8px
                  color: "#333", // Dark gray
                  fontWeight: "500",
                  fontSize: "0.875rem", // 14px
                  "@media (max-width:633px)": {
                    display: "none",
                  },
                }}
              >
                {group.groupName}
              </Typography>
            </div>
          ))}
        </>
      ) : (
        <>
          {new Array(2).fill(null).map((_, index) => (
            <UserCardSkeltion key={index} />
          ))}
        </>
      )}

      {/* Friends */}
      {!loadingUserFriends ? (
        <>
          {friends.map((user) => (
            <div
              key={user._id}
              className="people_cont"
              style={{
                display: "flex",
                height: "3.5rem", // 56px
                alignItems: "center",
                backgroundColor:
                  selectedUser && selectedUser._id === user._id
                    ? "#e3f2fd" // Light blue for selected state
                    : "#ffffff", // White background
                borderRadius: "0.5rem", // 8px
                marginBottom: "0.5rem", // 8px
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f1f5f9", // Subtle hover effect
                },
              }}
              onClick={() => handleSelectUser(user)}
            >
              <Typography
                variant="h6"
                className="people_img"
                sx={{
                  display: "flex",
                  position: "relative",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0.25rem", // 4px
                }}
              >
                <img
                  src={user.profilePic.cloud_url}
                  alt="Profile"
                  style={{
                    width: "2.25rem", // 36px
                    height: "2.25rem", // 36px
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #e0e0e0", // Subtle border
                  }}
                />
                {(onlineUsers &&
                  onlineUsers.find((e) => e._id === user._id)) ||
                user?.isAi ? (
                  <Typography
                    sx={{
                      display: "none",
                      "@media (min-width:1px) and (max-width:633px)": {
                        display: "inline",
                      },
                    }}
                  >
                    <span
                      style={{
                        width: "0.75rem", // 12px
                        height: "0.75rem", // 12px
                        borderRadius: "50%",
                        backgroundColor: "#4caf50", // Green for online
                        position: "absolute",
                        bottom: "0.25rem", // 4px
                        right: "0", // 0px
                        border: "2px solid #ffffff", // White border
                      }}
                    />
                  </Typography>
                ) : (
                  <Typography
                    sx={{
                      display: "none",
                      "@media (min-width:1px) and (max-width:633px)": {
                        display: "inline",
                      },
                    }}
                  >
                    <span
                      style={{
                        width: "0.75rem", // 12px
                        height: "0.75rem", // 12px
                        borderRadius: "50%",
                        backgroundColor: "#ef5350", // Red for offline
                        position: "absolute",
                        bottom: "0.25rem", // 4px
                        right: "0", // 0px
                        border: "2px solid #ffffff", // White border
                      }}
                    />
                  </Typography>
                )}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  wordBreak: "break-all",
                  padding: "0.5rem", // 8px
                  color: "#333", // Dark gray
                  fontWeight: "500",
                  fontSize: "0.875rem", // 14px
                  "@media (max-width:633px)": {
                    display: "none",
                  },
                }}
              >
                {user.fullName}
                {(onlineUsers &&
                  onlineUsers.find((e) => e._id === user._id)) ||
                user?.isAi ? (
                  <Typography
                    variant="subtitle2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#4caf50", // Green for online
                      fontSize: "0.75rem", // 12px
                      fontWeight: "400",
                    }}
                  >
                    <span
                      style={{
                        width: "0.5rem", // 8px
                        height: "0.5rem", // 8px
                        borderRadius: "50%",
                        backgroundColor: "#4caf50", // Green dot
                        marginRight: "0.25rem", // 4px
                      }}
                    />
                    Online
                  </Typography>
                ) : (
                  <Typography
                    variant="subtitle2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#ef5350", // Red for offline
                      fontSize: "0.75rem", // 12px
                      fontWeight: "400",
                    }}
                  >
                    <span
                      style={{
                        width: "0.5rem", // 8px
                        height: "0.5rem", // 8px
                        borderRadius: "50%",
                        backgroundColor: "#ef5350", // Red dot
                        marginRight: "0.25rem", // 4px
                      }}
                    />
                    Offline
                  </Typography>
                )}
              </Typography>
            </div>
          ))}

          <CreateDm />
          <div
            style={{
              display: "flex",
              height: "3.5rem", // 56px
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "black", // Professional blue
              borderRadius: "0.5rem", // 8px
              marginBottom: "0.5rem", // 8px
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "#1565c0", // Darker blue on hover
              },
            }}
            onClick={() => {
              dispatch(changeDm());
            }}
          >
            <Typography
              sx={{
                color: "#ffffff",
                fontWeight: "500",
                fontSize: "0.875rem", // 14px
                "@media (max-width:633px)": {
                  display: "none",
                },
                "@media (min-width:634px)": {
                  display: "inline-block",
                },
              }}
            >
              Create New DM
            </Typography>
            <ControlPointIcon
              className="add_dm_icon"
              sx={{
                color: "#ffffff",
                fontSize: "1.5rem", // 24px
                "@media (max-width:633px)": {
                  display: "block",
                },
                "@media (min-width:634px)": {
                  display: "none",
                },
              }}
            />
          </div>

          <CreateGroup />
          <div
            style={{
              display: "flex",
              height: "3.5rem", // 56px
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "black", // Professional blue
              borderRadius: "0.5rem", // 8px
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "#1565c0", // Darker blue on hover
              },
            }}
            onClick={() => {
              dispatch(changeGroupBox());
            }}
          >
            <Typography
              sx={{
                color: "#ffffff",
                fontWeight: "500",
                fontSize: "0.875rem", // 14px
                "@media (max-width:633px)": {
                  display: "none",
                },
                "@media (min-width:634px)": {
                  display: "block",
                },
              }}
            >
              Create New Group
            </Typography>
            <GroupAddIcon
              className="add_dm_icon"
              sx={{
                color: "#ffffff",
                fontSize: "1.5rem", // 24px
                "@media (max-width:633px)": {
                  display: "inline-block",
                },
                "@media (min-width:634px)": {
                  display: "none",
                },
              }}
            />
          </div>
        </>
      ) : (
        <>
          {new Array(8).fill(null).map((_, index) => (
            <UserCardSkeltion key={index} />
          ))}
        </>
      )}
    </Box>
  );
}

export default Sidebar;