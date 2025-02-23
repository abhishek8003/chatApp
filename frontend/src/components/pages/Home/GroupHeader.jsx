import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../../redux/features/selectedUser";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import { setSelectedGroup } from "../../../redux/features/selectedGroup";
function GroupHeader() {
    let selectedGroup = useSelector((store) => {
        return store.selectedGroup;
      });
      let dispatch=useDispatch();
  return (
    <div
      className="chat-head-main"
      style={{
        border: "2px solid brown",
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
            <img src={selectedGroup.groupIcon.cloud_url} alt="Group_icon" />
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
            {selectedGroup.groupName}
          </Typography>
        </div>
      </div>
      <div
        style={{
          // border: "2px solid red",
          padding: "0.5rem",
        }}
        onClick={() => {
          dispatch(setSelectedGroup(null));
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
    </div>
  );
}

export default GroupHeader;
