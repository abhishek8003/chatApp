import React from "react";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import Sidebar from "./Sidebar";
import MessagePlaceholder from "./MessagePlaceholder";
import { useSelector } from "react-redux";
import Messages from "./Messages";

function Home() {
  let selectedUser = useSelector((store) => {
    return store.selectedUser;
  });

  
  return (
    <>
      <Navbar></Navbar>

      <div
        className=" p-1 border"
        style={{
          display: "flex",
          flexWrap: "nowrap",
          minWidth: "fit-content",
        }}
      >
        <Sidebar></Sidebar>
        <div style={{flexGrow:"1", border:"2px solid yellow"}}>
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
