import { Box, Skeleton } from "@mui/material";
import React from "react";

function ChatbodySkeltion() {
  return (
    <div
      style={{
        height: "80%",
        overflow: "auto",
        scrollbarWidth: "thin",
        width: "100%",
        border: "2px solid blue",
      }}
    >
      {new Array(3).fill(null).map((_, index) => (
        <React.Fragment key={index}>
          <Box sx={{ display: "flex", gap: "2px", flexDirection: "row" ,marginBottom:"20px" }}>
            <Skeleton variant="circular" width={70} height={70} />
            <Skeleton variant="rounded" width={210} height={70} />
          </Box>
          <Box
            sx={{ display: "flex", gap: "2px", flexDirection: "row-reverse" ,marginBottom:"20px" }}
          >
            <Skeleton variant="rounded" width={210} height={70} />
            <Skeleton variant="circular" width={70} height={70} />
          </Box>
        </React.Fragment>
      ))}
    </div>
  );
}

export default ChatbodySkeltion;
