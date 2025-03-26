import { Box, Modal, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationToggle } from "../../../redux/features/notificationToggle";
import { setSelectedUser } from "../../../redux/features/selectedUser";
import { setSelectedGroup } from "../../../redux/features/selectedGroup";
import {
  deleteNotification,
  intializeNotification,
} from "../../../redux/features/notifications";
import { backendContext } from "../../../BackendProvider";

function NotificationPanel() {
  const { notificationToggle, notification, users } = useSelector((store) => ({
    notificationToggle: store.notificationToggle,
    notification: store.notification,
    users: store.users,
  }));
  const groups = useSelector((store) => store.groups);
  const backendUrl = useContext(backendContext);
  const userAuth = useSelector((store) => store.userAuth);
  const selectedGroup = useSelector((store) => store.selectedGroup);
  const dispatch = useDispatch();

  const handleNotificationClick = async (message) => {
    try {
      const response = await fetch(`${backendUrl}/api/notifications/`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...message, image: "" }),
      });
      if (response.ok) {
        dispatch(deleteNotification(message));
        if (message.isGroupChat) {
          const targetGroup = groups.find((g) => g._id === message.receiverId);
          dispatch(setSelectedUser(null));
          dispatch(setSelectedGroup(targetGroup));
        } else {
          const senderUser = users.find((u) => u._id === message.senderId);
          dispatch(setSelectedGroup(null));
          dispatch(setSelectedUser(senderUser));
        }
        dispatch(setNotificationToggle());
      } else {
        console.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <Modal
      open={notificationToggle}
      onClose={() => dispatch(setNotificationToggle())}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "60%", md: "40%" },
          maxHeight: "70vh",
          overflowY: "auto",
          backgroundColor: "#fafafa", // Light gray background
          padding: "1.5rem", // 24px
          borderRadius: "0.75rem", // 12px
          boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.2)", // Stronger shadow for modal
          position: "relative",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: "0.375rem" }, // 6px
          "&::-webkit-scrollbar-thumb": {
            background: "#bdbdbd", // Gray scrollbar thumb
            borderRadius: "0.5rem", // 8px
          },
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: "0.5rem", // 8px
            right: "0.5rem", // 8px
            color: "#757575", // Medium gray
            "&:hover": {
              color: "#333", // Dark gray on hover
            },
          }}
          onClick={() => dispatch(setNotificationToggle())}
        >
          <CloseIcon sx={{ fontSize: "1.5rem" }} /> {/* 24px */}
        </IconButton>

        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: 600,
            color: "#333", // Dark gray
            fontSize: "1.5rem", // 24px
            mb: "1rem", // 16px
          }}
        >
          Notifications
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{
            color: "#757575", // Medium gray
            fontSize: "1rem", // 16px
            mb: "1.5rem", // 24px
          }}
        >
          You have {notification.length} new{" "}
          {notification.length === 1 ? "notification" : "notifications"}
        </Typography>

        <Box>
          {notification.length > 0 ? (
            notification.map((message, index) => {
              if (!message.isGroupChat) {
                const sender = users.find((e) => e._id === message.senderId);
                return (
                  <Box
                    key={index}
                    sx={{
                      p: "1rem", // 16px
                      mb: "0.75rem", // 12px
                      backgroundColor: "#ffffff", // White card
                      borderRadius: "0.5rem", // 8px
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem", // 16px
                      boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.05)", // Subtle shadow
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#f5f5f5", // Light gray hover
                      },
                    }}
                    onClick={() => handleNotificationClick(message)}
                  >
                    {sender?.profilePic?.cloud_url && (
                      <img
                        src={sender.profilePic.cloud_url}
                        height="60px" // 60px
                        width="60px" // 60px
                        alt="Group Icon"
                        style={{
                          borderRadius: "0.5rem", // 8px
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Box flex={1}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: "#333", // Dark gray
                          fontSize: "1rem", // 16px
                        }}
                      >
                        {sender ? sender.fullName : "Unknown"}
                      </Typography>
                      {message.text && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#388e3c", // Green for text
                            fontSize: "0.875rem", // 14px
                            mt: "0.25rem", // 4px
                          }}
                        >
                          {message.text}
                        </Typography>
                      )}
                      {message?.image && (
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#1976d2", // Blue for image indicator
                              fontSize: "0.875rem", // 14px
                              mt: "0.25rem", // 4px
                            }}
                          >
                            Image
                          </Typography>
                          {/* <img
                            src={message?.image}
                            height="60px" // 60px
                            width="60px" // 60px
                            alt="Notification"
                            style={{
                              borderRadius: "0.5rem", // 8px
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          /> */}
                        </>
                      )}
                      {message.createdAt && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#757575", // Medium gray
                            fontSize: "0.75rem", // 12px
                            mt: "0.25rem", // 4px
                          }}
                        >
                          {new Date(message.createdAt).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              }
              if (message.isGroupChat && groups) {
                const targetGroup = groups.find(
                  (g) => g._id === message.receiverId
                );
                return (
                  <Box
                    key={index}
                    sx={{
                      p: "1rem", // 16px
                      mb: "0.75rem", // 12px
                      backgroundColor: "#ffffff", // White card
                      borderRadius: "0.5rem", // 8px
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem", // 16px
                      boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.05)", // Subtle shadow
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#f5f5f5", // Light gray hover
                      },
                    }}
                    onClick={() => handleNotificationClick(message)}
                  >
                    {targetGroup?.groupIcon?.cloud_url && (
                      <img
                        src={targetGroup.groupIcon.cloud_url}
                        height="60px" // 60px
                        width="60px" // 60px
                        alt="Group Icon"
                        style={{
                          borderRadius: "0.5rem", // 8px
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Box flex={1}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: "#333", // Dark gray
                          fontSize: "1rem", // 16px
                        }}
                      >
                        {targetGroup ? targetGroup.groupName : "Unknown Group"}
                      </Typography>
                      {message.text && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#388e3c", // Green for text
                            fontSize: "0.875rem", // 14px
                            mt: "0.25rem", // 4px
                          }}
                        >
                          {message.text}
                        </Typography>
                      )}
                      {message?.image && (
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#1976d2", // Blue for image indicator
                              fontSize: "0.875rem", // 14px
                              mt: "0.25rem", // 4px
                            }}
                          >
                            Image
                          </Typography>
                          {/* <img
                            src={message?.image}
                            height="60px" // 60px
                            width="60px" // 60px
                            alt="Notification"
                            style={{
                              borderRadius: "0.5rem", // 8px
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          /> */}
                        </>
                      )}
                      {message.createdAt && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#757575", // Medium gray
                            fontSize: "0.75rem", // 12px
                            mt: "0.25rem", // 4px
                          }}
                        >
                          {new Date(message.createdAt).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              }
              return null; // Fallback for invalid cases
            })
          ) : (
            <Typography
              variant="body2"
              align="center"
              sx={{
                color: "#757575", // Medium gray
                fontSize: "0.875rem", // 14px
                py: "1rem", // 16px
              }}
            >
              No new notifications
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
}

export default NotificationPanel;
