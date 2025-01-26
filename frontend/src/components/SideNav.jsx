import React from "react";
import { sideNavToggle } from "../redux/features/sideNav";
import MessageIcon from "@mui/icons-material/Message";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Drawer, List, ListItem, Typography } from "@mui/material";
import { NavLink } from "react-router";
import { loggingOutToggle } from "../redux/features/logOut";

import toast from "react-hot-toast";
import { setUser } from "../redux/features/userAuth";
function sideNav() {
  let sideNav = useSelector((store) => {
    return store.sideNav;
  });
  
  let userAuth = useSelector((store) => {
    return store.userAuth;
  });
  let loggingOut = useSelector((store) => {
    return store.loggingOut;
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
      <Drawer
        open={sideNav}
        onClose={() => {
          dispatch(sideNavToggle());
        }}
      >
        <List sx={{ bgcolor: "black", height: "100vh", width: "250px" }}>
          <Box
            sx={{
              padding: "8px 16px",
              display: "flex",
            }}
          >
            <Typography variant="h5" sx={{ color: "white " }}>
              <MessageIcon />
            </Typography>

            <Typography
              variant="h5"
              sx={{ color: "white ", marginLeft: "10px" }}
            >
              Chatify
            </Typography>
          </Box>
          {userAuth ? (
            <>
              <ListItem>
                <NavLink
                  to="/" onClick={()=>{dispatch(sideNavToggle())}}
                  
                  className={({ isActive }) =>
                    isActive ? "isActive" : "isNotActive"
                  }
                >
                  <Typography variant="h6">Home</Typography>
                </NavLink>
              </ListItem>
              <ListItem>
                <NavLink
                  to="/profile"
                  onClick={()=>{dispatch(sideNavToggle())}}
                  className={({ isActive }) =>
                    isActive ? "isActive" : "isNotActive"
                  }
                >
                  <Typography variant="h6">Profile</Typography>
                </NavLink>
              </ListItem>

              <ListItem>
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
                  onClick={() => {dispatch(sideNavToggle());handleLogout()}}
                >
                  {loggingOut ? "Logging Out" : "Log out"}
                </Button>
              </ListItem>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={()=>{dispatch(sideNavToggle())}}
                className={({ isActive }) =>
                  isActive ? "isActive" : "isNotActive"
                }
              >
                <Typography variant="h6">Login</Typography>
              </NavLink>
              <NavLink
                to="/signup"
                onClick={()=>{dispatch(sideNavToggle())}}
                className={({ isActive }) =>
                  isActive ? "isActive" : "isNotActive"
                }
              >
                <Typography variant="h6">Register</Typography>
              </NavLink>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}

export default sideNav;
