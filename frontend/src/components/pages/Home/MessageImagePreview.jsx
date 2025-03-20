import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageImagePreviewToggle } from "../../../redux/features/messageImagePreview";
import { Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function MessageImagePreview() {
  const dispatch = useDispatch();
  const messageImagePreview = useSelector((store) => store.messageImagePreview);
  const messageImagePreviewUrl = useSelector(
    (store) => store.messageImagePreviewUrl
  );

  return (
    <Modal
      open={messageImagePreview}
      onClose={() => dispatch(messageImagePreviewToggle())}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(4px)", // Subtle backdrop blur
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark semi-transparent overlay
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "80%", md: "70%" },
          height: { xs: "70vh", sm: "80vh" },
          backgroundColor: "#212121", // Dark gray (softer than black)
          borderRadius: "0.75rem", // 12px
          boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.3)", // Stronger shadow
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          border: "none", // Removed white border
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={() => dispatch(messageImagePreviewToggle())}
          sx={{
            position: "absolute",
            top: "0.5rem", // 8px
            right: "0.5rem", // 8px
            color: "#ffffff", // White
            "&:hover": {
              color: "#d32f2f", // Red on hover
            },
          }}
        >
          <CloseIcon sx={{ fontSize: "1.75rem" }} /> {/* 28px */}
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
            padding: "1rem", // 16px
          }}
        >
          <img
            src={messageImagePreviewUrl}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "0.5rem", // 8px subtle rounding
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
}

export default MessageImagePreview;