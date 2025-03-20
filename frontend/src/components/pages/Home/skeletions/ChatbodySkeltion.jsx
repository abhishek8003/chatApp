import { Box, Skeleton } from "@mui/material";
import React from "react";

function ChatbodySkeleton() {
  return (
    <Box
      sx={{
        height: "100%", // Full height to fit chat body
        overflow: "auto",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { width: "0.375rem" }, // 6px
        "&::-webkit-scrollbar-thumb": {
          background: "#bdbdbd", // Gray scrollbar thumb
          borderRadius: "0.5rem", // 8px
        },
        width: "100%",
        background: "#ffffff", // Clean white background
        borderTop: "0.0625rem solid #e0e0e0", // 1px subtle top border
        padding: "1rem", // 16px padding for breathing room
      }}
    >
      {new Array(3).fill(null).map((_, index) => (
        <React.Fragment key={index}>
          {/* Sent Message (Left-aligned) */}
          <Box
            sx={{
              display: "flex",
              gap: "0.5rem", // 8px
              flexDirection: "row",
              marginBottom: "1rem", // 16px
            }}
          >
            <Skeleton
              variant="circular"
              width="3.5rem" // 56px
              height="3.5rem" // 56px
              sx={{
                bgcolor: "#e0e0e0", // Subtle gray
                flexShrink: 0,
              }}
            />
            <Skeleton
              variant="rounded"
              width="15rem" // 240px
              height="3.5rem" // 56px
              sx={{
                bgcolor: "#e0e0e0", // Subtle gray
                borderRadius: "0.75rem", // 12px, softer corners
              }}
            />
          </Box>

          {/* Received Message (Right-aligned) */}
          <Box
            sx={{
              display: "flex",
              gap: "0.5rem", // 8px
              flexDirection: "row-reverse",
              marginBottom: "1rem", // 16px
            }}
          >
            <Skeleton
              variant="circular"
              width="3.5rem" // 56px
              height="3.5rem" // 56px
              sx={{
                bgcolor: "#e0e0e0", // Subtle gray
                flexShrink: 0,
              }}
            />
            <Skeleton
              variant="rounded"
              width="15rem" // 240px
              height="3.5rem" // 56px
              sx={{
                bgcolor: "#e0e0e0", // Subtle gray
                borderRadius: "0.75rem", // 12px, softer corners
              }}
            />
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
}

export default ChatbodySkeleton;