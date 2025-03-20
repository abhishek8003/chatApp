import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../../redux/features/selectedUser";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import { setSelectedGroup } from "../../../redux/features/selectedGroup";
import { setGroupInfoToggle } from "../../../redux/features/groupInfoToggle";
import GroupInfo from "./GroupInfo";

function GroupHeader() {
  let selectedGroup = useSelector((store) => store.selectedGroup);
  let dispatch = useDispatch();
  let targetElement = useRef();

  useEffect(() => {
    console.log(targetElement.current);
  }, [targetElement]);

  return (
    <div
      className="chat-head-main"
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#ffffff", // Clean white background
        borderBottom: "0.0625rem solid #e0e0e0", // 1px subtle border
        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.05)", // 2px 4px soft shadow
        padding: "0.75rem", // 12px
        borderRadius: "0.5rem 0.5rem 0 0", // 8px top corners only
      }}
    >
      {/* Left Section (Group Info) */}
      <div
        style={{
          padding: "0.25rem", // 4px
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          transition: "background 0.2s ease",
          "&:hover": {
            background: "#f5f5f5", // Light gray hover
            borderRadius: "0.5rem", // 8px
          },
        }}
        onClick={() => {
          dispatch(setGroupInfoToggle());
        }}
        ref={targetElement}
      >
        <Typography
          variant="h6"
          className="people_img"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "0.75rem", // 12px
          }}
        >
          <img
            src={selectedGroup.groupIcon.cloud_url}
            alt="Group_icon"
            style={{
              width: "2.5rem", // 40px
              height: "2.5rem", // 40px
              borderRadius: "50%",
              objectFit: "cover",
              border: "0.0625rem solid #e0e0e0", // 1px subtle border
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)", // Slight enlarge on hover
              },
            }}
          />
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#333", // Dark gray for contrast
            fontWeight: "500",
            fontSize: "1.125rem", // 18px
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {selectedGroup.groupName}
        </Typography>
      </div>

      {/* Right Section (Close Button) */}
      <div
        style={{
          padding: "0.25rem", // 4px
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          transition: "background 0.2s ease",
          "&:hover": {
            background: "#f5f5f5", // Light gray hover
            borderRadius: "50%", // Circular hover area
          },
        }}
        onClick={() => {
          dispatch(setSelectedGroup(null));
        }}
      >
        <CloseIcon
          sx={{
            fontSize: "1.75rem", // 28px
            color: "#757575", // Medium gray
            transition: "color 0.2s ease",
            "&:hover": {
              color: "#d32f2f", // Soft red on hover
            },
          }}
        />
      </div>

      <GroupInfo targetElement={targetElement} />
    </div>
  );
}

export default GroupHeader;