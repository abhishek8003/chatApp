import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageImagePreviewToggle } from "../../../redux/features/messageImagePreview";
import { Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function MessageImagePreview() {
  const dispatch = useDispatch();
  const messageImagePreview = useSelector((store) => store.messageImagePreview);
  const messageImagePreviewUrl = useSelector((store) => store.messageImagePreviewUrl);

  return (
    <Modal
      open={messageImagePreview}
      onClose={() => dispatch(messageImagePreviewToggle())}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "rgba(0, 0, 0, 0.8)", 
      }}
    >
      <Box
        sx={{
          color: "white",
          border: "2px solid white",
          backgroundColor: "black",
          width: { xs: "90%", sm: "80%", md: "70%" },
          height: { xs: "70%", sm: "80%" }, 
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={() => dispatch(messageImagePreviewToggle())}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "white",
            fontSize: "2rem",
            "&:hover": { color: "red" },
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>

        {/* Image Display */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "10px",
          }}
        >
          <img
            src={messageImagePreviewUrl}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
}

export default MessageImagePreview;
