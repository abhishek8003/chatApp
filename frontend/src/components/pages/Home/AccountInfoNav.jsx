import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
import { useDispatch, useSelector } from "react-redux";
import { setaccountDetailView } from "../../../redux/features/accountDetailView";

function AccountInfoNav() {
  let accountDetailView = useSelector((store) => store.accountDetailView);
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
        height: "100%", // Full height of parent (AccountInfo Popover)
      }}
    >
      <Tooltip title="Overview" placement="right">
        <IconButton
          onClick={() => {
            dispatch(setaccountDetailView("overview"));
          }}
          sx={{
            padding: "0.75rem", // 12px
            color: accountDetailView === "overview" ? "#1976d2" : "#757575", // Blue when active, gray otherwise
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

      {/* Uncomment to re-enable Settings button */}
      {/* <Tooltip title="Settings" placement="right">
        <IconButton
          onClick={() => {
            dispatch(setaccountDetailView("settings"));
          }}
          sx={{
            padding: "0.75rem", // 12px
            color: accountDetailView === "settings" ? "#1976d2" : "#757575", // Blue when active, gray otherwise
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
      </Tooltip> */}
    </Box>
  );
}

export default AccountInfoNav;