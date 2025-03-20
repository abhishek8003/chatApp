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
      body: JSON.stringify(targetUserNotifications[0]),
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
      body: JSON.stringify(targetGroupNotifications[0]),
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
        gap: "0.75rem", // 12px
        height: "80vh",
        overflow: "auto",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { width: "0.5rem" }, // 8px
        "&::-webkit-scrollbar-thumb": {
          background: "linear-gradient(135deg, #00c4cc, #7b1fa2)",
          borderRadius: "1rem", // 16px
          boxShadow: "inset 0 0 0.25rem rgba(255, 255, 255, 0.3)", // 4px
        },
        borderRadius: "1rem", // 16px
        background: "linear-gradient(145deg, rgba(240, 244, 248, 0.9) 0%, rgba(227, 242, 253, 0.9) 100%)",
        backdropFilter: "blur(10px)", // Glassmorphism effect
        border: "0.0625rem solid rgba(255, 255, 255, 0.2)", // 1px subtle border
        boxShadow: "0 0.5rem 2rem rgba(0, 0, 0, 0.15)", // 8px 32px
        padding: "0.75rem", // 12px
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
          height: "4.375rem", // 70px
          marginBottom: "0.75rem", // 12px
          background: "linear-gradient(135deg, #00c4cc, #7b1fa2)",
          borderRadius: "0.75rem", // 12px
          boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.2)", // 4px 12px
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 0.375rem 1rem rgba(0, 0, 0, 0.25)", // 6px 16px
          },
        }}
      >
        <Typography
          variant="h6"
          className="people_img"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <PeopleIcon sx={{ fontSize: "2.5rem", filter: "drop-shadow(0 0 0.25rem rgba(255, 255, 255, 0.5))" }} />
        </Typography>
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontWeight: "700",
            background: "linear-gradient(45deg, #fff, #e0f7fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.2)", // 2px 4px
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
            padding: "1.5rem", // 24px
            fontSize: "1.125rem", // 18px
            fontStyle: "italic",
            background: "linear-gradient(45deg, #00c4cc, #7b1fa2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)", // 2px 4px
            animation: "pulse 2s infinite",
            "@media (min-width:1px) and (max-width:633px)": {
              display: "none",
            },
          }}
        >
          No Groups or Friends yet? Start connecting!
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
                height: "4.375rem", // 70px
                alignItems: "center",
                background: selectedGroup && selectedGroup._id === group._id
                  ? "linear-gradient(135deg, #7b1fa2, #ab47bc)"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.9))",
                backdropFilter: "blur(5px)", // Glass effect
                borderRadius: "0.75rem", // 12px
                marginBottom: "0.75rem", // 12px
                boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)", // 4px 12px
                border: "0.0625rem solid rgba(255, 255, 255, 0.3)", // 1px
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02) translateY(-0.125rem)", // Slight scale + lift
                  boxShadow: "0 0.375rem 1rem rgba(0, 0, 0, 0.2)", // 6px 16px
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
                  padding: "0.375rem", // 6px
                }}
              >
                <img
                  src={group.groupIcon.cloud_url}
                  alt="Group"
                  style={{
                    width: "2.75rem", // 44px
                    height: "2.75rem", // 44px
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "0.125rem solid #fff", // 2px
                    boxShadow: "0 0 0.5rem rgba(123, 31, 162, 0.7)", // 8px
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "rotate(5deg)" },
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
                  padding: "0.625rem", // 10px
                  color: selectedGroup && selectedGroup._id === group._id ? "#fff" : "#333",
                  fontWeight: "600",
                  textShadow: "0 0.0625rem 0.125rem rgba(0, 0, 0, 0.1)", // 1px 2px
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
                height: "4.375rem", // 70px
                alignItems: "center",
                background: selectedUser && selectedUser._id === user._id
                  ? "linear-gradient(135deg, #7b1fa2, #ab47bc)"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.9))",
                backdropFilter: "blur(5px)", // Glass effect
                borderRadius: "0.75rem", // 12px
                marginBottom: "0.75rem", // 12px
                boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)", // 4px 12px
                border: "0.0625rem solid rgba(255, 255, 255, 0.3)", // 1px
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02) translateY(-0.125rem)", // Slight scale + lift
                  boxShadow: "0 0.375rem 1rem rgba(0, 0, 0, 0.2)", // 6px 16px
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
                  padding: "0.375rem", // 6px
                }}
              >
                <img
                  src={user.profilePic.cloud_url}
                  alt="Profile"
                  style={{
                    width: "2.75rem", // 44px
                    height: "2.75rem", // 44px
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "0.125rem solid #fff", // 2px
                    boxShadow: "0 0 0.5rem rgba(123, 31, 162, 0.7)", // 8px
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "rotate(5deg)" },
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
                        width: "1.125rem", // 18px
                        height: "1.125rem", // 18px
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #00e676, #76ff03)",
                        position: "absolute",
                        bottom: "0.5rem", // 8px
                        right: "0", // 0px
                        boxShadow: "0 0 0.375rem rgba(0, 230, 118, 0.8)", // 6px
                        border: "0.0625rem solid #fff", // 1px
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
                        width: "1.125rem", // 18px
                        height: "1.125rem", // 18px
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #ff1744, #f44336)",
                        position: "absolute",
                        bottom: "0.5rem", // 8px
                        right: "0", // 0px
                        boxShadow: "0 0 0.375rem rgba(255, 23, 68, 0.8)", // 6px
                        border: "0.0625rem solid #fff", // 1px
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
                  padding: "0.625rem", // 10px
                  color: selectedUser && selectedUser._id === user._id ? "#fff" : "#333",
                  fontWeight: "600",
                  textShadow: "0 0.0625rem 0.125rem rgba(0, 0, 0, 0.1)", // 1px 2px
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
                      color: selectedUser && selectedUser._id === user._id ? "#fff" : "#00e676",
                      fontSize: "0.875rem", // 14px
                      fontWeight: "500",
                    }}
                  >
                    <span
                      style={{
                        width: "0.625rem", // 10px
                        height: "0.625rem", // 10px
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #00e676, #76ff03)",
                        marginRight: "0.375rem", // 6px
                        boxShadow: "0 0 0.25rem rgba(0, 230, 118, 0.8)", // 4px
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
                      color: selectedUser && selectedUser._id === user._id ? "#fff" : "#ff1744",
                      fontSize: "0.875rem", // 14px
                      fontWeight: "500",
                    }}
                  >
                    <span
                      style={{
                        width: "0.625rem", // 10px
                        height: "0.625rem", // 10px
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #ff1744, #f44336)",
                        marginRight: "0.375rem", // 6px
                        boxShadow: "0 0 0.25rem rgba(255, 23, 68, 0.8)", // 4px
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
              height: "4.375rem", // 70px
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #00c4cc, #7b1fa2)",
              borderRadius: "0.75rem", // 12px
              marginBottom: "0.75rem", // 12px
              boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.2)", // 4px 12px
              border: "0.0625rem solid rgba(255, 255, 255, 0.3)", // 1px
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.03) translateY(-0.125rem)", // Slight scale + lift
                boxShadow: "0 0.375rem 1rem rgba(0, 0, 0, 0.25)", // 6px 16px
                background: "linear-gradient(135deg, #00e676, #ab47bc)",
              },
            }}
            onClick={() => {
              dispatch(changeDm());
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: "700",
                fontSize: "1.25rem", // 20px
                textShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.2)", // 2px 4px
                "@media (max-width:633px)": {
                  display: "none",
                },
                "@media (min-width:634px)": {
                  display: "inline-block",
                },
              }}
            >
              Create new DM
            </Typography>
            <ControlPointIcon
              className="add_dm_icon"
              sx={{
                color: "#fff",
                fontSize: "2rem", // 32px
                filter: "drop-shadow(0 0 0.25rem rgba(255, 255, 255, 0.5))",
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
              height: "4.375rem", // 70px
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #00c4cc, #7b1fa2)",
              borderRadius: "0.75rem", // 12px
              boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.2)", // 4px 12px
              border: "0.0625rem solid rgba(255, 255, 255, 0.3)", // 1px
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.03) translateY(-0.125rem)", // Slight scale + lift
                boxShadow: "0 0.375rem 1rem rgba(0, 0, 0, 0.25)", // 6px 16px
                background: "linear-gradient(135deg, #00e676, #ab47bc)",
              },
            }}
            onClick={() => {
              dispatch(changeGroupBox());
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: "700",
                fontSize: "1.25rem", // 20px
                textShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.2)", // 2px 4px
                "@media (max-width:633px)": {
                  display: "none",
                },
                "@media (min-width:634px)": {
                  display: "block",
                },
              }}
            >
              Create new Group!
            </Typography>
            <GroupAddIcon
              className="add_dm_icon"
              sx={{
                color: "#fff",
                fontSize: "2rem", // 32px
                filter: "drop-shadow(0 0 0.25rem rgba(255, 255, 255, 0.5))",
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