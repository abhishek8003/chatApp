import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
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
function Navbar() {
  let loggingOut = useSelector((store) => {
    return store.loggingOut;
  });

  let checkingAuth = useSelector((store) => {
    return store.checkingAuth;
  });
  let sideNav = useSelector((store) => {
    return store.sideNav;
  });

  let userAuth = useSelector((store) => {
    return store.userAuth;
  });
  let dispatch = useDispatch();

  let handleLogout = async () => {
    try {
      console.log(loggingOut);

      dispatch(loggingOutToggle());
      let response = await fetch("http://localhost:5000/api/auth/logout", {
        credentials: "include",
      });
      let json = await response.json();
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
    <>
      <AppBar sx={{ position: "sticky", bgcolor: "black" }}>
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
              <Typography variant="h6">Chatify</Typography>
            </NavLink>
          </Box>
          {userAuth ? (
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
