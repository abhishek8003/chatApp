import { Box, Popover, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setaccountInfoToggle } from "../../../redux/features/accountInfoToggle";
import AccountInfoNav from "./AccountInfoNav";
import Overview from "./accountDetail/Overview";
import Settings from "./accountDetail/Settings";

function AccountInfo({ targetElement }) {
  let accountInfoToggle = useSelector((store) => store.accountInfoToggle);
  let dispatch = useDispatch();
  let selectedUser = useSelector((store) => store.selectedUser);
  let accountDetailView = useSelector((store) => store.accountDetailView);

  return (
    <Popover
      open={accountInfoToggle}
      onClose={() => {
        dispatch(setaccountInfoToggle());
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
          minWidth: "21.875rem", // 350px
          minHeight: "18.75rem", // 300px
        },
      }}
    >
      {console.log("in pop:", selectedUser)}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          minHeight: "18.75rem", // 300px
          width: "21.875rem", // 350px
          padding: "1rem", // 16px
          background: "#fafafa", // Very light gray for depth
        }}
      >
        {/* Navigation Section */}
        <AccountInfoNav />

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
          {accountDetailView === "overview" ? <Overview /> : null}
          {accountDetailView === "settings" ? <Settings /> : null}
          {/* If no view is selected, show a placeholder */}
          {accountDetailView !== "overview" && accountDetailView !== "settings" && (
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
          )}
        </Box>
      </Box>
    </Popover>
  );
}

export default AccountInfo;