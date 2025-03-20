import { Box, Skeleton } from "@mui/material";
import React from "react";

function UserCardSkeleton() {
  return (
    <Box
      sx={{
        width: "100%",
        padding: "0.5rem", // 8px padding for breathing room
        background: "#ffffff", // Clean white background
      }}
    >
      <Skeleton
        animation="wave"
        variant="rectangular"
        width="100%"
        height="4.375rem" // 70px
        sx={{
          bgcolor: "#e0e0e0", // Subtle gray
          borderRadius: "0.5rem", // 8px, softer corners
          marginBottom: "0.125rem", // 2px, tightened for minimal spacing
        }}
      />
    </Box>
  );
}

export default UserCardSkeleton;