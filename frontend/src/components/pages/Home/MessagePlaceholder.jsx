import { Box, Typography } from "@mui/material";
import React from "react";

function MessagePlaceholder() {
  return (
    <Box
      sx={{
        height: "80vh",
        minWidth: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // "@media (min-width:1px) and (max-width:500px)":{
        //   display:"none"
        // }
      }}
    >
      <Box sx={{ border: "2px solid red", padding:"2rem" }}>
        <Typography variant="h6" sx={{"& i":{
          fontSize:"3rem"
        },"textAlign":"center"}}>
          <i class="fa-duotone fa-solid fa-message fa-bounce" style={{color:"#8080806b"}}></i>
        </Typography>
        <Typography variant="h6" sx={{ textAlign:"center", fontWeight:"bolder", marginBottom:"20px"}}>
          Welcome to Chatify!
        </Typography>
        <Typography sx={{ textAlign:"center",fontSize:"1rem"}}>
          Select a conversation from the sidebar to start chatting
        </Typography>
      </Box>
    </Box>
  );
}

export default MessagePlaceholder;
