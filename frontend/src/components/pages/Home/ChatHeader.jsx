import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../../redux/features/selectedUser";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import AccountInfo from "./AccountInfo";
import {  setaccountInfoToggle } from "../../../redux/features/accountInfoToggle";
function ChatHeader() {
    let selectedUser = useSelector((store) => {
        return store.selectedUser;
      });
      let dispatch=useDispatch();
      let anchorElement=useRef();
  return (
    <div
      className="chat-head-main"
      style={{
        border: "2px solid brown",
        position:"relative",
        // padding: "10px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
        //   width: "301px",
        //   border: "2px solid red",
          padding: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "black",
            // border: "2px solid red",
          }}
          ref={anchorElement}
          onClick={()=>{
            console.log("tiiiajfajfaimfpamsf");
            dispatch(setaccountInfoToggle());
          }}
        >
          <Typography
            variant="h6"
            className="people_img"
            sx={{
              display: "flex",
              height: "70px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={selectedUser.profilePic.cloud_url} alt="Profile" />
          </Typography>
          <Typography
            variant="body1"
            sx={{
              flexGrow: "1",
              height: "70px",
              display: "flex",
            
              alignItems: "center",
            }}
           
          >
            {selectedUser.fullName}
          </Typography>
        </div>
      </div>
      <div
        style={{
         
          padding: "0.5rem",
        }}
        onClick={() => {
          dispatch(setSelectedUser(null));
        }}
      >
        <CloseIcon
          sx={{
            height: "70px",
            fontSize: "2.5rem",
            // border:"2px solid pink"
          }}
        ></CloseIcon>
      </div>
      <AccountInfo targetElement={anchorElement}></AccountInfo>
    </div>
  );
}

export default ChatHeader;
