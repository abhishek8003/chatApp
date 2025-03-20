import { Box, Typography, CircularProgress } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const formatDate = (date) =>
  date ? new Date(date).toLocaleString("en-IN") : "N/A";

function Overview() {
  const selectedUser = useSelector((store) => store.selectedUser);
  const chats = useSelector((store) => store.chats);

  if (!selectedUser) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "18.75rem", // Matches AccountInfo/GroupInfo min height (300px)
        }}
      >
        <CircularProgress sx={{ color: "#757575" }} /> {/* Medium gray spinner */}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "1rem", // 16px, matches parent padding
        display: "flex",
        flexDirection: "column",
        gap: "1rem", // 16px
        height: "100%",
        overflow: "auto",
      }}
    >
      {/* Profile Picture & Name */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem", // 8px
        }}
      >
        <Box
          sx={{
            height: "6.25rem", // 100px
            width: "6.25rem", // 100px
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "0.0625rem solid #e0e0e0", // 1px subtle border
            boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.05)", // 2px 4px soft shadow
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "scale(1.05)", // Slight enlarge on hover
            },
          }}
        >
          <img
            src={selectedUser?.profilePic?.cloud_url}
            alt="User Profile"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "600",
            color: "#333", // Dark gray for contrast
            textTransform: "capitalize",
            fontSize: "1.25rem", // 20px
          }}
        >
          {selectedUser?.fullName || "Unknown User"}
        </Typography>
      </Box>

      {/* Divider */}
      <Box
        sx={{
          borderBottom: "0.0625rem solid #e0e0e0", // 1px subtle line
          margin: "0.75rem 0", // 12px
        }}
      />

      {/* Account Details */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem", // 16px
        }}
      >
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "500",
              color: "#757575", // Medium gray
              fontSize: "0.875rem", // 14px
            }}
          >
            Created
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#333", // Dark gray
              fontSize: "0.875rem", // 14px
            }}
          >
            {formatDate(selectedUser?.createdAt)}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "500",
              color: "#757575", // Medium gray
              fontSize: "0.875rem", // 14px
            }}
          >
            Last Message
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#333", // Dark gray
              fontSize: "0.875rem", // 14px
            }}
          >
            {formatDate(chats[chats.length - 1]?.createdAt)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Overview;