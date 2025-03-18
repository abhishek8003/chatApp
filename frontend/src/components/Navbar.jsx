import { AppBar, Badge, Box, Button, Toolbar, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import MessageIcon from "@mui/icons-material/Message";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import toast from "react-hot-toast";
import { setUser } from "../redux/features/userAuth";
import MenuIcon from "@mui/icons-material/Menu";
import { setCheckingAuth } from "../redux/features/checkingAuth";
import { sideNavToggle } from "../redux/features/sideNav";
import SideNav from "./SideNav.jsx";
import { loggingOutToggle } from "../redux/features/logOut";
import { socketContext } from "../SocketProvider.jsx";
import { backendContext } from "../BackendProvider.jsx";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { setNotificationToggle } from "../redux/features/notificationToggle.js";
import NotificationPanel from "./pages/Home/NotificationPanel.jsx";
import { setSelectedGroup } from "../redux/features/selectedGroup.js";
import { setSelectedUser } from "../redux/features/selectedUser.js";
function Navbar() {
  let backendUrl = useContext(backendContext);
  let loggingOut = useSelector((store) => {
    return store.loggingOut;
  });

  let checkingAuth = useSelector((store) => {
    return store.checkingAuth;
  });
  let sideNav = useSelector((store) => {
    return store.sideNav;
  });
  let notification = useSelector((store) => {
    return store.notification;
  });
  let userAuth = useSelector((store) => {
    return store.userAuth;
  });
  let clientSocket = useContext(socketContext);
  console.log(clientSocket);

  let dispatch = useDispatch();
  let notificationToggle = useSelector((store) => {
    return store.notificationToggle;
  });

  let handleLogout = async () => {
    try {
      console.log(loggingOut);

      dispatch(loggingOutToggle());
      let response = await fetch(`${backendUrl}/api/auth/logout`, {
        credentials: "include",
      });
      let json = await response.json();
      if (response.status === 200) {
        console.log(userAuth);

        clientSocket?.emit("deleteOnlineUser", userAuth);
        dispatch(setUser(null));
        dispatch(setSelectedGroup(null));
        dispatch(setSelectedUser(null))
        toast.success(json.message);
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      dispatch(loggingOutToggle());
    }
  };
  return (
    <>
      <AppBar sx={{ position: "sticky", bgcolor: "black" , width:"100%"}}>
        <Toolbar>
          <Box
            sx={{
              width: "120px",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <NavLink style={{ color: "white", textDecoration: "none" }}>
              <Typography variant="h6">
                <MessageIcon />
              </Typography>
            </NavLink>
            <NavLink style={{ color: "white", textDecoration: "none" }}>
              <Typography variant="h6">ChatApp</Typography>
            </NavLink>
          </Box>
          {userAuth ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  marginLeft: "auto",
                  "@media (max-width:699px)": { display: "none" },
                }}
              >
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "isActive" : "isNotActive"
                  }
                >
                  <Typography variant="h6">Home</Typography>
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? "isActive" : "isNotActive"
                  }
                >
                  <Typography variant="h6">Profile</Typography>
                </NavLink>
                <Typography variant="h6">
                  Welcome,{userAuth.fullName}
                </Typography>
                <Typography variant="h6">
                  <Badge
                    badgeContent={
                      notification.length > 9
                        ? "9+"
                        : notification.length.toString()
                    }
                    color="primary"
                    onClick={() => {
                      dispatch(setNotificationToggle());
                    }}
                    sx={{
                      "& .MuiBadge-badge": {
                        minWidth: "27px", // Ensures enough space for two-digit numbers
                        height: "27px",
                        fontSize: "0.75rem", // Adjust font size
                        padding: "0 6px", // Ensures content fits
                      },
                    }}
                  >
                    <Typography variant="h6"><MessageIcon /></Typography>
                    
                  </Badge>
                </Typography>
                <NotificationPanel></NotificationPanel>
                <Button
                  variant="contained"
                  color="success"
                  style={{
                    backgroundColor: loggingOut ? "red" : "green",
                    color: "white",
                  }}
                  sx={{
                    color: "white",
                  }}
                  loading={loggingOut}
                  loadingPosition="start"
                  onClick={() => handleLogout()}
                >
                  {loggingOut ? "Logging Out" : "Log out"}
                </Button>
              </Box>
              <Box
                sx={{
                  display: "none",
                  gap: "10px",
                  marginLeft: "auto",
                  "@media (max-width:700px)": { display: "flex",
                    justifyContent:"flex-end",
                    alignItems:"center"
                   },
                }}
              >
                <Typography variant="h6">
                  <Badge
                    badgeContent={
                      notification.length > 9
                        ? "9+"
                        : notification.length.toString()
                    }
                    color="primary"
                    onClick={() => {
                      dispatch(setNotificationToggle());
                    }}
                    sx={{
                      "& .MuiBadge-badge": {
                        minWidth: "27px", // Ensures enough space for two-digit numbers
                        height: "27px",
                        fontSize: "0.75rem", // Adjust font size
                        padding: "0 6px", // Ensures content fits
                      },
                    }}
                  >
                    <Typography variant="h6"><MessageIcon /></Typography>
                    
                  </Badge>
                </Typography>
                <NotificationPanel></NotificationPanel>
                <MenuIcon
                  onClick={() => {
                    dispatch(sideNavToggle());
                  }}
                ></MenuIcon>

                <SideNav></SideNav>
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  marginLeft: "auto",
                  "@media (max-width:600px)": { display: "none" },
                }}
              >
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "isActive" : "isNotActive"
                  }
                >
                  <Typography variant="h6">Login</Typography>
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive ? "isActive" : "isNotActive"
                  }
                >
                  <Typography variant="h6">Register</Typography>
                </NavLink>
              </Box>
              <Box
                sx={{
                  display: "none",
                  gap: "10px",
                  marginLeft: "auto",
                  "@media (max-width:600px)": { display: "flex" },
                }}
              >
                <MenuIcon
                  onClick={() => {
                    dispatch(sideNavToggle());
                  }}
                ></MenuIcon>

                <SideNav></SideNav>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
