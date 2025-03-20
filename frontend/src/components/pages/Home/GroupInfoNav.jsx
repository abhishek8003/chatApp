import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { useDispatch, useSelector } from "react-redux";
import { setgroupDetailView } from "../../../redux/features/groupDetailView";

function GroupInfoNav() {
  let groupDetailView = useSelector((store) => store.groupDetailView);
  let dispatch = useDispatch();

  return (
    <Box
      sx={{
        width: "3.75rem", // 60px
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#fafafa", // Very light gray for depth
        borderRight: "0.0625rem solid #e0e0e0", // 1px subtle border
        padding: "0.5rem 0", // 8px vertical padding
        height: "100%", // Full height of parent (GroupInfo Popover)
      }}
    >
      <Tooltip title="Overview" placement="right">
        <IconButton
          onClick={() => {
            dispatch(setgroupDetailView("overview"));
          }}
          sx={{
            padding: "0.75rem", // 12px
            color: groupDetailView === "overview" ? "#1976d2" : "#757575", // Blue when active, gray otherwise
            "&:hover": {
              backgroundColor: "#f0f0f0", // Light gray hover
              color: "#333", // Dark gray on hover
            },
            "& .MuiSvgIcon-root": {
              fontSize: "1.75rem", // 28px
            },
          }}
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Members" placement="right">
        <IconButton
          onClick={() => {
            dispatch(setgroupDetailView("members"));
          }}
          sx={{
            padding: "0.75rem", // 12px
            color: groupDetailView === "members" ? "#1976d2" : "#757575", // Blue when active, gray otherwise
            "&:hover": {
              backgroundColor: "#f0f0f0", // Light gray hover
              color: "#333", // Dark gray on hover
            },
            "& .MuiSvgIcon-root": {
              fontSize: "1.75rem", // 28px
            },
          }}
        >
          <PersonIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Settings" placement="right">
        <IconButton
          onClick={() => {
            dispatch(setgroupDetailView("settings"));
          }}
          sx={{
            padding: "0.75rem", // 12px
            color: groupDetailView === "settings" ? "#1976d2" : "#757575", // Blue when active, gray otherwise
            "&:hover": {
              backgroundColor: "#f0f0f0", // Light gray hover
              color: "#333", // Dark gray on hover
            },
            "& .MuiSvgIcon-root": {
              fontSize: "1.75rem", // 28px
            },
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default GroupInfoNav;