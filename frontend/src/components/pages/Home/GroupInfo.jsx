import { Box, Popover, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGroupInfoToggle } from "../../../redux/features/groupInfoToggle";
import GroupInfoNav from "./GroupInfoNav";
import Overview from "./groupDetail/Overview";
import Settings from "./groupDetail/Settings";
import Members from "./groupDetail/Members";

function GroupInfo({ targetElement }) {
  let groupInfoToggle = useSelector((store) => store.groupInfoToggle);
  let dispatch = useDispatch();
  let selectedGroup = useSelector((store) => store.selectedGroup);
  let groupDetailView = useSelector((store) => store.groupDetailView);

  return (
    <Popover
      open={groupInfoToggle}
      onClose={() => {
        dispatch(setGroupInfoToggle());
      }}
      anchorEl={targetElement.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      PaperProps={{
        sx: {
          borderRadius: "0.75rem", // 12px
          boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)", // 4px 12px
          border: "0.0625rem solid #e0e0e0", // 1px subtle border
          background: "#ffffff", // Clean white background
          overflow: "hidden", // Ensures content respects border radius
          width: "21.875rem", // 350px
          minHeight: "18.75rem", // 300px
          maxHeight: "21.875rem", // 350px
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          minHeight: "18.75rem", // 300px
          maxHeight: "21.875rem", // 350px
          width: "21.875rem", // 350px
          padding: "1rem", // 16px
          background: "#fafafa", // Very light gray for depth
        }}
      >
        {/* Navigation Section */}
        <GroupInfoNav />

        {/* Content Section */}
        <Box
          sx={{
            flexGrow: 1,
            border: "0.0625rem solid #e0e0e0", // 1px subtle border
            borderRadius: "0.5rem", // 8px
            background: "#ffffff", // White content area
            padding: "1rem", // 16px
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: "0.375rem" }, // 6px
            "&::-webkit-scrollbar-thumb": {
              background: "#bdbdbd", // Gray scrollbar thumb
              borderRadius: "0.5rem", // 8px
            },
          }}
        >
          {groupDetailView === "overview" ? <Overview /> : null}
          {groupDetailView === "settings" ? <Settings /> : null}
          {groupDetailView === "members" ? <Members /> : null}
          {/* If no view is selected, show a placeholder */}
          {groupDetailView !== "overview" &&
          groupDetailView !== "settings" &&
          groupDetailView !== "members" ? (
            <Typography
              sx={{
                color: "#757575", // Medium gray
                fontSize: "0.875rem", // 14px
                fontStyle: "italic",
                textAlign: "center",
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Select an option to view details
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Popover>
  );
}

export default GroupInfo;