import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router"; // Fixed import (react-router)
import { Box, Button, Drawer, List, ListItem, Typography } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import { sideNavToggle } from "../redux/features/sideNav";
import { loggingOutToggle } from "../redux/features/logOut";
import { setUser } from "../redux/features/userAuth";
import { backendContext } from "../BackendProvider";
import toast from "react-hot-toast";

function SideNav() {
  const backendUrl = useContext(backendContext);
  const sideNav = useSelector((store) => store.sideNav);
  const userAuth = useSelector((store) => store.userAuth);
  const loggingOut = useSelector((store) => store.loggingOut);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(loggingOutToggle());
      const response = await fetch(`${backendUrl}/api/auth/logout`, {
        credentials: "include",
      });
      const json = await response.json();
      if (response.status === 200) {
        dispatch(setUser(null));
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
    <Drawer
      anchor="right" // Changed to right for a modern mobile feel
      open={sideNav}
      onClose={() => dispatch(sideNavToggle())}
      sx={{
        "& .MuiDrawer-paper": {
          width: "15rem", // 240px, slightly slimmer than 250px
          backgroundColor: "#212121", // Dark gray (softer than black)
          color: "#ffffff", // White text
          boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.2)", // Subtle shadow
        },
      }}
    >
      <List sx={{ height: "100%", padding: "1rem 0" }}> {/* 16px vertical padding */}
        {/* Header */}
        <Box
          sx={{
            padding: "1rem 1.5rem", // 16px 24px
            display: "flex",
            alignItems: "center",
            gap: "0.75rem", // 12px
            borderBottom: "0.0625rem solid #424242", // 1px subtle gray border
          }}
        >
          <MessageIcon sx={{ fontSize: "1.75rem", color: "#ffffff" }} /> {/* 28px */}
          <Typography
            variant="h5"
            sx={{
              fontSize: "1.5rem", // 24px
              fontWeight: 600,
              color: "#ffffff",
            }}
          >
            Chatify
          </Typography>
        </Box>

        {/* Navigation Items */}
        {userAuth ? (
          <>
            <ListItem sx={{ padding: "0.5rem 1.5rem" }}> {/* 8px 24px */}
              <NavLink
                to="/"
                onClick={() => dispatch(sideNavToggle())}
                style={({ isActive }) => ({
                  color: isActive ? "#1976d2" : "#ffffff",
                  textDecoration: "none",
                  width: "100%",
                })}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem", // 16px
                    fontWeight: 500,
                    "&:hover": { color: "#bdbdbd" }, // Light gray on hover
                  }}
                >
                  Home
                </Typography>
              </NavLink>
            </ListItem>
            <ListItem sx={{ padding: "0.5rem 1.5rem" }}> {/* 8px 24px */}
              <NavLink
                to="/profile"
                onClick={() => dispatch(sideNavToggle())}
                style={({ isActive }) => ({
                  color: isActive ? "#1976d2" : "#ffffff",
                  textDecoration: "none",
                  width: "100%",
                })}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem", // 16px
                    fontWeight: 500,
                    "&:hover": { color: "#bdbdbd" }, // Light gray on hover
                  }}
                >
                  Profile
                </Typography>
              </NavLink>
            </ListItem>
            <ListItem sx={{ padding: "0.5rem 1.5rem" }}> {/* 8px 24px */}
              <Button
                variant="contained"
                sx={{
                  width: "100%",
                  bgcolor: loggingOut ? "#d32f2f" : "#388e3c", // Red when logging out, green otherwise
                  color: "#ffffff",
                  textTransform: "none",
                  padding: "0.5rem 1rem", // 8px 16px
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
                onClick={() => {
                  dispatch(sideNavToggle());
                  handleLogout();
                }}
              >
                {loggingOut ? "Logging Out" : "Log Out"}
              </Button>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem sx={{ padding: "0.5rem 1.5rem" }}> {/* 8px 24px */}
              <NavLink
                to="/login"
                onClick={() => dispatch(sideNavToggle())}
                style={({ isActive }) => ({
                  color: isActive ? "#1976d2" : "#ffffff",
                  textDecoration: "none",
                  width: "100%",
                })}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem", // 16px
                    fontWeight: 500,
                    "&:hover": { color: "#bdbdbd" }, // Light gray on hover
                  }}
                >
                  Login
                </Typography>
              </NavLink>
            </ListItem>
            <ListItem sx={{ padding: "0.5rem 1.5rem" }}> {/* 8px 24px */}
              <NavLink
                to="/signup"
                onClick={() => dispatch(sideNavToggle())}
                style={({ isActive }) => ({
                  color: isActive ? "#1976d2" : "#ffffff",
                  textDecoration: "none",
                  width: "100%",
                })}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem", // 16px
                    fontWeight: 500,
                    "&:hover": { color: "#bdbdbd" }, // Light gray on hover
                  }}
                >
                  Register
                </Typography>
              </NavLink>
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
}

export default SideNav;