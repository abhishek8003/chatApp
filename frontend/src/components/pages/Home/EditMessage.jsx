import { Box, Modal, Typography, TextField, Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { seteditMessageToggle } from "../../../redux/features/editMessageToggle";
import { setSelectedChat } from "../../../redux/features/selectedChat";
import { editChats } from "../../../redux/features/Chats";
import { socketContext } from "../../../SocketProvider";
import { backendContext } from "../../../BackendProvider";
import toast from "react-hot-toast";

function EditMessage() {
  const dispatch = useDispatch();
  const editMessageToggle = useSelector((store) => store.editMessageToggle);
  let selectedChat = useSelector((store) => store.selectedChat);
  let clientSocket = useContext(socketContext);
  let userAuth = useSelector((store) => store.userAuth);
  let selectedUser = useSelector((store) => store.selectedUser);

  // Placeholder for the message to edit (replace with actual message from Redux)
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(selectedChat?.text); // Replace with actual message data
  let backendUrl=useContext(backendContext)

  const handleSave = async (message) => {
    setSaving(true);
    if (selectedUser && selectedChat) {
      console.log("Updated message:", message);
      dispatch(setSelectedChat({ ...selectedChat, text: message }));
      dispatch(
        editChats({
          senderId: userAuth._id,
          receiverId: selectedUser._id,
          text: message,
          image: selectedChat?.image,
          createdAt: selectedChat.createdAt,
          status: "editing message...",
          isGroupChat: selectedChat.isGroupChat,
        })
      );
      clientSocket?.emit("editMessage", {
        senderId: userAuth._id,
        receiverId: selectedUser._id,
        text: message,
        image: selectedChat?.image, 
        createdAt: selectedChat.createdAt,
        status: "editing message...",
        isGroupChat: selectedChat.isGroupChat,
      });
      try {
        const response = await fetch(`${backendUrl}/api/chats/`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...selectedChat,
            // image: selectedChat.image,
            text: message,
          }),
        });
        let json = await response.json();
        if (response.status == 200) {
          console.log(
            "MEssage  edited after saving to database:",
            json.message
          ); //json.message is an Array
          console.log("onlineUsers sdf:", onlineUsers);
          const receiver = onlineUsers.find(
            (u) => u._id === json.message.receiverId
          );
          const receiverStatus = !!receiver; // Converts `receiver` to a boolean
          console.log(receiverStatus);
          if (!receiverStatus) {
            console.log("FUOAJDPOJ{OJ123123123");
            dispatch(editChats(json.message));
          }
        }
        else{
          toast.error(json.message)
        }
      } catch (error) {
        
      } finally {
        dispatch(seteditMessageToggle(false));
      }
    }
  };

  const handleCancel = () => {
    setMessage("This is the message to edit.");
    // dispatch(seteditMessageToggle(false));
  };
  useEffect(() => {
    setMessage(selectedChat?.text);
  }, [selectedChat]);

  return (
    <Modal
      open={editMessageToggle}
      onClose={() => dispatch(seteditMessageToggle(false))}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "400px" }, // Responsive width
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white for glass effect
          backdropFilter: "blur(8px)", // Glassmorphism blur
          border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle glass border
          borderRadius: "12px", // Rounded corners
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Light shadow for depth
          padding: "1.5rem", // 24px padding
          display: "flex",
          flexDirection: "column",
          gap: "1rem", // 16px gap between elements
        }}
      >
        {/* Modal Title */}
        <Typography
          id="edit-message-modal-title"
          variant="h6"
          component="h2"
          sx={{
            color: "#333", // Dark gray for readability
            fontWeight: "600",
            fontSize: "1.25rem", // 20px
          }}
        >
          Edit Message
        </Typography>

        {/* Modal Description */}
        <Typography
          id="edit-message-modal-description"
          sx={{
            color: "#666", // Muted gray for description
            fontSize: "0.875rem", // 14px
            marginBottom: "0.5rem", // 8px
          }}
        >
          Modify your message below and save your changes.
        </Typography>

        {/* TextField for Editing the Message */}
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          maxRows={1} // Limit the number of rows to prevent excessive growth
          fullWidth
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && message.trim().length) {
              // If Enter is pressed without Shift, submit the form if there is content
              handleSave(message);
              setMessage("");
            } else if (e.key === "Enter" && e.shiftKey) {
              e.preventDefault();
              setMessage((prev) => prev + "\n");
            }
          }}
          placeholder="Type your message..."
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.5)", // Subtle background
              borderRadius: "8px", // Rounded corners
              "& fieldset": {
                borderColor: "rgba(0, 0, 0, 0.1)", // Subtle border
              },
              "&:hover fieldset": {
                borderColor: "rgba(0, 0, 0, 0.2)", // Slightly darker on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1976d2", // Blue border when focused
              },
            },
            "& .MuiInputBase-input": {
              height: "30px",
              color: "#333", // Dark gray text
              fontSize: "0.875rem", // 14px
            },
          }}
        />

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem", // 8px gap between buttons
            marginTop: "1rem", // 16px
          }}
        >
          <Button
            onClick={handleCancel}
            variant="outlined"
            sx={{
              textTransform: "none",
              color: "#666", // Muted gray
              borderColor: "rgba(0, 0, 0, 0.2)", // Subtle border
              borderRadius: "8px", // Rounded corners
              padding: "0.5rem 1rem", // 8px 16px
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.05)", // Subtle hover effect
                borderColor: "rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSave(message);
            }}
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#1976d2", // Professional blue
              color: "#fff", // White text
              borderRadius: "8px", // Rounded corners
              padding: "0.5rem 1rem", // 8px 16px
              "&:hover": {
                backgroundColor: "#115293", // Darker blue on hover
              },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditMessage;
