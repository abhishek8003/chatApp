import { AppBar, Badge, Box, Button, Toolbar, Typography } from "@mui/material";
import React, { useContext } from "react";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router"; 
import toast from "react-hot-toast";
import { setUser } from "../redux/features/userAuth";
import { setCheckingAuth } from "../redux/features/checkingAuth";
import { sideNavToggle } from "../redux/features/sideNav";
import SideNav from "./SideNav.jsx";
import { loggingOutToggle } from "../redux/features/logOut";
import { socketContext } from "../SocketProvider.jsx";
import { backendContext } from "../BackendProvider.jsx";
import { setNotificationToggle } from "../redux/features/notificationToggle.js";
import NotificationPanel from "./pages/Home/NotificationPanel.jsx";
import { setSelectedGroup } from "../redux/features/selectedGroup.js";
import { setSelectedUser } from "../redux/features/selectedUser.js";

function Navbar() {
  const backendUrl = useContext(backendContext);
  const clientSocket = useContext(socketContext);
  const loggingOut = useSelector((store) => store.loggingOut);
  const checkingAuth = useSelector((store) => store.checkingAuth);
  const sideNav = useSelector((store) => store.sideNav);
  const notification = useSelector((store) => store.notification);
  const userAuth = useSelector((store) => store.userAuth);
  const notificationToggle = useSelector((store) => store.notificationToggle);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(loggingOutToggle());
      const response = await fetch(`${backendUrl}/api/auth/logout`, {
        credentials: "include",
      });
      const json = await response.json();
      if (response.status === 200) {
        clientSocket?.emit("deleteOnlineUser", userAuth);
        dispatch(setUser(null));
        dispatch(setSelectedGroup(null));
        dispatch(setSelectedUser(null));
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
    <AppBar
      sx={{
        position: "sticky",
        top: 0,
        bgcolor: "#212121", // Dark gray (softer than pure black)
        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)", // Subtle shadow
        width: "100%",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "0 1rem", // 0 16px
          minHeight: "4rem", // 64px
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem", // 12px
            width: "auto",
          }}
        >
          <NavLink to="/" style={{ color: "#ffffff", textDecoration: "none" }}>
            <MessageIcon sx={{ fontSize: "1.75rem" }} /> {/* 28px */}
          </NavLink>
          <NavLink to="/" style={{ color: "#ffffff", textDecoration: "none" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: "1.25rem" }} // 20px
            >
              ChatApp
            </Typography>
          </NavLink>
        </Box>

        {/* Authenticated User Nav */}
        {userAuth ? (
          <>
            {/* Desktop Nav */}
            <Box
              sx={{
                display: "flex",
                gap: "1.5rem", // 24px
                marginLeft: "auto",
                alignItems: "center",
                "@media (max-width: 699px)": { display: "none" },
              }}
            >
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "isActive" : "")}
                style={({ isActive }) => ({
                  color: isActive ? "#1976d2" : "#ffffff",
                  textDecoration: "none",
                })}
              >
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1rem", fontWeight: 500 }} // 16px
                >
                  Home
                </Typography>
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "isActive" : "")}
                style={({ isActive }) => ({
                  color: isActive ? "#1976d2" : "#ffffff",
                  textDecoration: "none",
                })}
              >
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1rem", fontWeight: 500 }} // 16px
                >
                  Profile
                </Typography>
              </NavLink>
              <Typography
                variant="h6"
                sx={{ color: "#bdbdbd", fontSize: "1rem" }} // 16px, light gray
              >
                Welcome, {userAuth.fullName}
              </Typography>
              <Badge
                badgeContent={
                  notification.length > 9 ? "9+" : notification.length
                }
                color="primary"
                onClick={() => dispatch(setNotificationToggle())}
                sx={{
                  cursor: "pointer",
                  "& .MuiBadge-badge": {
                    minWidth: "1.25rem", // 20px
                    height: "1.25rem", // 20px
                    fontSize: "0.75rem", // 12px
                    padding: "0 0.375rem", // 0 6px
                    borderRadius: "0.625rem", // 10px
                  },
                }}
              >
                <NotificationsIcon
                  sx={{ color: "#ffffff", fontSize: "1.75rem" }} // 28px
                />
              </Badge>
              <NotificationPanel />
              <Button
                variant="contained"
                sx={{
                  bgcolor: loggingOut ? "#d32f2f" : "#388e3c", // Red when logging out, green otherwise
                  color: "#ffffff",
                  textTransform: "none",
                  padding: "0.375rem 1rem", // 6px 16px
                  fontSize: "0.875rem", // 14px
                  borderRadius: "0.5rem", // 8px
                  "&:hover": {
                    bgcolor: loggingOut ? "#b71c1c" : "#2e7d32", // Darker shades on hover
                  },
                  "&:disabled": {
                    bgcolor: "#757575", // Gray when disabled
                  },
                }}
                disabled={loggingOut}
                onClick={handleLogout}
              >
                {loggingOut ? "Logging Out" : "Log Out"}
              </Button>
            </Box>

            {/* Mobile Nav */}
            <Box
              sx={{
                display: "none",
                gap: "1rem", // 16px
                marginLeft: "auto",
                alignItems: "center",
                "@media (max-width: 699px)": { display: "flex" },
              }}
            >
              <Badge
                badgeContent={
                  notification.length > 9 ? "9+" : notification.length
                }
                color="primary"
                onClick={() => dispatch(setNotificationToggle())}
                sx={{
                  cursor: "pointer",
                  "& .MuiBadge-badge": {
                    minWidth: "1.25rem", // 20px
                    height: "1.25rem", // 20px
                    fontSize: "0.75rem", // 12px
                    padding: "0 0.375rem", // 0 6px
                    borderRadius: "0.625rem", // 10px
                  },
                }}
              >
                <NotificationsIcon
                  sx={{ color: "#ffffff", fontSize: "1.75rem" }} // 28px
                />
              </Badge>
              <NotificationPanel />
              <MenuIcon
                onClick={() => dispatch(sideNavToggle())}
                sx={{ color: "#ffffff", fontSize: "1.75rem" }} // 28px
              />
              <SideNav />
            </Box>
          </>
        ) : (
          <>
            {/* Desktop Nav (Unauthenticated) */}
            <Box
              sx={{
                display: "flex",
                gap: "1.5rem", // 24px
                marginLeft: "auto",
                alignItems: "center",
                "@media (max-width: 600px)": { display: "none" },
              }}
            >
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "isActive" : "")}
                style={({ isActive }) => ({
                  color: isActive ? "#1976d2" : "#ffffff",
                  textDecoration: "none",
                })}
              >
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1rem", fontWeight: 500 }} // 16px
                >
                  Login
                </Typography>
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) => (isActive ? "isActive" : "")}
                style={({ isActive }) => ({
                  color: isActive ? "#1976d2" : "#ffffff",
                  textDecoration: "none",
                })}
              >
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1rem", fontWeight: 500 }} // 16px
                >
                  Register
                </Typography>
              </NavLink>
            </Box>

            {/* Mobile Nav (Unauthenticated) */}
            <Box
              sx={{
                display: "none",
                gap: "1rem", // 16px
                marginLeft: "auto",
                alignItems: "center",
                "@media (max-width: 600px)": { display: "flex" },
              }}
            >
              <MenuIcon
                onClick={() => dispatch(sideNavToggle())}
                sx={{ color: "#ffffff", fontSize: "1.75rem" }} // 28px
              />
              <SideNav />
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;