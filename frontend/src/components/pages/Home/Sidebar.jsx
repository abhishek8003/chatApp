import {
  Avatar,
  Box,
  CircularProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PeopleIcon from "@mui/icons-material/People";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setUsers } from "../../../redux/features/users";
import { setSelectedUser } from "../../../redux/features/selectedUser";
import UserCardSkeltion from "./skeletions/userCardSkeltion";

function Sidebar() {
  let [loadingUser, setLoadingUsers] = useState(true);
  let users = useSelector((store) => {
    return store.users;
  });
  let selectedUser = useSelector((store) => {
    return store.selectedUser;
  });

  let handleSelectUser = (user) => {
    console.log("selecting a user", user);
    dispatch(setSelectedUser(user));
  };

  let dispatch = useDispatch();

  useEffect(() => {
    let getAllUsers = async () => {
      try {
        let response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          credentials: "include",
        });
        let json = await response.json();
        if (response.status === 200) {
          console.log(json.users);
          dispatch(setUsers(json.users));
        } else {
          toast.error(json.message);
        }
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      } finally {
        setLoadingUsers(false);
      }
    };
    getAllUsers();
  }, []);

  return (
    <Box
      sx={{
        
        gap: "10px",
        border: "2px solid blue",
        height: "80vh",
        overflow: "auto",
        scrollbarWidth: "thin",
        "@media (min-width:0px) and (max-width:600px)": {
          minWidth: "85px",
          maxWidth:"86px"
        },
        "@media (min-width:601px) and (max-width: 850px)": {
          minWidth: "250px",
          maxWidth:"251px"
        },
        "@media (min-width:851px)": {
          minWidth: "350px",
          maxWidth:"351px"
        },
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "4px",
          padding: "3px",
          height: "70px",
          // border: "2px solid pink",
          marginBottom: "10px",
        }}
      >
        <Typography
          variant="h6"
          className="people_img"
          sx={{
            display: "flex",

            justifyContent: "center",
            alignItems: "center",
          
          }}
        >
          <PeopleIcon sx={{fontSize:"2.25rem",}} />
        </Typography>
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "@media (max-width:600px)": {
              display: "none",
            },
          }}
        >
          Contacts
        </Typography>
      </div>

      {!loadingUser ? (
        users.map((user) => {
          return (
            <div
              key={user._id}
              className="people_cont"
              style={{
                display: "flex",
                height: "70px",
                
                backgroundColor:
                  selectedUser && selectedUser._id === user._id
                    ? "#3f51b5" 
                    : "",
                color:
                  selectedUser && selectedUser._id === user._id
                    ? "white"
                    : "black", 
                cursor: "pointer", 
                
              }}
              onClick={() => handleSelectUser(user)}
            >
              <Typography
                variant="h6"
                className="people_img"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                
                }}
              >
                <img src={user.profilePic.cloud_url} alt="Profile" />
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  flexGrow:"1",
                  display: "flex",
                 
                  alignItems: "center",
                  "@media (max-width:600px)": {
                    display: "none",
                  },
                }}
              >
                {user.fullName}
              </Typography>
            </div>
          );
        })
      ) : (
        <>
          {new Array(8).fill(null).map(() => {
            return (
              <UserCardSkeltion></UserCardSkeltion>
            );
          })}
        </>
      )}
    </Box>
  );
}

export default Sidebar;
