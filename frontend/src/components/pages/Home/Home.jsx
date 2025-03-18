import React, { useContext, useEffect } from "react";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import Sidebar from "./Sidebar";
import MessagePlaceholder from "./MessagePlaceholder";
import { useDispatch, useSelector } from "react-redux";
import Messages from "./Messages";
import { socketContext } from "../../../SocketProvider";
import { setOnlineUsers } from "../../../redux/features/onlineUsers";
import { backendContext } from "../../../BackendProvider";
import { intializeNotification } from "../../../redux/features/notifications";
import { Box } from "@mui/material";

function Home() {
  let selectedUser = useSelector((store) => {
    return store.selectedUser;
  });
  let selectedGroup = useSelector((store) => {
    return store.selectedGroup;
  });
  let userAuth = useSelector((store) => {
    return store.userAuth;
  });
  let groups = useSelector((store) => {
    return store.groups;
  });
  let dispatch = useDispatch();
  let clientSocket = useContext(socketContext);
  let backendUrl = useContext(backendContext);
  useEffect(() => {
    console.log("setted x");
    clientSocket?.emit("fetchAllUsers"); //to set all_users

    clientSocket?.on("getOnlineUsers", (onlineUsers) => {
      console.log("online:");
      console.log(onlineUsers);
      dispatch(setOnlineUsers(onlineUsers));
    });
    return () => {
      clientSocket?.off("getOnlineUsers");
      clientSocket?.off("fetchAllUsers");
      // dispatch(setOnlineUsers(null));
      console.log("home unmouted!");
    };
  }, []);
  useEffect(() => {
    let fetchNotifications = async () => {
      console.log("fetching notifications...");
      try {
        if (userAuth) {
          let response = await fetch(
            `${backendUrl}/api/notifications/${userAuth._id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          let json = await response.json();
          if (response.status == 200) {
            console.log("current notifications:", json.all_notifications);
            let filteredNotification = json.all_notifications.filter((e) => {
              if (e.senderId != userAuth._id) {
                return true;
              }
              return false;
            });
            dispatch(intializeNotification(filteredNotification));
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotifications();
  }, [userAuth]);
  useEffect(() => {
    document.body.style.overflowX = "hidden"; // Disable scroll

    return () => {
      document.body.style.overflow = "auto"; // Re-enable scroll on unmount
    };
  }, []);

  useEffect(() => {
    console.log("groups changed!");
    // alert("groups changed!",groups)
  }, [groups]);
  return (
    <>
      <Box sx={{ overflow: "hidden" }}>
        <Navbar></Navbar>
        <div
          className="p-1"
          style={{
            border: "2px solid green",
            display: "flex",
            flexWrap: "nowrap",
            minWidth: "fit-content",
            overflow: "hidden",
          }}
        >
          <Sidebar></Sidebar>
          <div style={{ flexGrow: "1" }}>
            {!selectedUser && !selectedGroup ? (
              <MessagePlaceholder />
            ) : (
              <Messages />
            )}
          </div>
        </div>
        <Footer></Footer>
      </Box>
    </>
  );
}

export default Home;
