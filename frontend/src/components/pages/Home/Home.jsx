import React, { useContext, useEffect } from "react";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import Sidebar from "./Sidebar";
import MessagePlaceholder from "./MessagePlaceholder";
import { useDispatch, useSelector } from "react-redux";
import Messages from "./Messages";
import { socketContext } from "../../../SocketProvider";
import { setOnlineUsers } from "../../../redux/features/onlineUsers";

function Home() {
  let selectedUser = useSelector((store) => {
    return store.selectedUser;
  });
  let userAuth = useSelector((store) => {
    return store.userAuth;
  });
  let dispatch = useDispatch();
  let clientSocket = useContext(socketContext);

  useEffect(() => {
    console.log("setted x");
    clientSocket.emit("fetchAllUsers"); //to set all_users

    clientSocket.on("getOnlineUsers", (onlineUsers) => {
      console.log("online:");
      console.log(onlineUsers);
      dispatch(setOnlineUsers(onlineUsers));
    });
    return ()=>{
      clientSocket.off("getOnlineUsers");
      clientSocket.off("fetchAllUsers");
      // dispatch(setOnlineUsers(null));
    }
  },[]);
  return (
    <>
      <Navbar></Navbar>
      <div
        className="p-1 border"
        style={{
          display: "flex",
          flexWrap: "nowrap",
          minWidth: "fit-content",
        }}
      >
        <Sidebar></Sidebar>
        <div style={{ flexGrow: "1", border: "2px solid yellow" }}>
          {!selectedUser ? (
            <MessagePlaceholder></MessagePlaceholder>
          ) : (
            <Messages></Messages>
          )}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default Home;
