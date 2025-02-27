import { Box, Modal, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useContext, useEffect } from "react";
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
  let groups = useSelector((store) => {
    return store.groups;
  });
  let backendUrl=useContext(backendContext);
  let userAuth = useSelector((store) => {
    return store.userAuth;
  });
  let selectedGroup = useSelector((store) => {
    return store.selectedGroup;
  });
  const dispatch = useDispatch();
  return (
    <Modal
      open={notificationToggle}
      onClose={() => dispatch(setNotificationToggle())}
      sx={{
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          height: "auto",
          width: { xs: "90%", sm: "60%", md: "40%" },
          maxHeight: "70vh",
          overflowY: "auto",
          backgroundColor: "#222",
          p: 3,
          borderRadius: "12px",
          color: "white",
          position: "relative",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
          onClick={() => dispatch(setNotificationToggle())}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" align="center" fontWeight={600} mb={2}>
          Notifications
        </Typography>
        <Typography variant="body1" align="center" mb={2}>
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
                      p: 2,
                      mb: 1,
                      backgroundColor: "#333",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Box
                      flex={1}
                      textAlign={{ xs: "center", sm: "left" }}
                      onClick={() => {
                        let senderUser = users.find((u) => {
                          if (u._id == message.senderId) {
                            return true;
                          }
                        });
                        console.log(senderUser);
                        let response =  fetch(
                          `${backendUrl}/api/notifications/`,
                          {
                            method: "DELETE",
                            credentials: "include",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(message),
                          }
                        );
                        dispatch(deleteNotification(message));
                        dispatch(setSelectedGroup(null));
                        dispatch(setSelectedUser(senderUser));
                        dispatch(setNotificationToggle());
                      }}
                    >
                      <Typography variant="body1" fontWeight={500}>
                        {sender ? sender.fullName : "Unknown"}
                      </Typography>
                      {message.text && (
                        <Typography variant="body2" color="green" mt={0.5}>
                          {message.text}
                        </Typography>
                      )}

                      {message.createdAt && (
                        <Typography variant="caption" color="gray" mt={0.5}>
                          {new Date(message.createdAt).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                    {message.image && (
                      <img
                        src={message.image}
                        height="60"
                        width="60"
                        alt="Notification"
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                      />
                    )}
                  </Box>
                );
              }
              if (message.isGroupChat && groups ) {
                console.log(groups);
                console.log(message.receiverId);
                let targetGroup = groups.find((g) => {
                  if (g._id == message.receiverId) {
                    return true;
                  }
                });

                console.log("targetGroup", targetGroup);

                return (
                  <>
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        mb: 1,
                        backgroundColor: "#333",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <Box
                        flex={1}
                        textAlign={{ xs: "center", sm: "left" }}
                        onClick={() => {
                          console.log(targetGroup);
                          dispatch(deleteNotification(message));
                          let response =  fetch(
                            `${backendUrl}/api/notifications/`,
                            {
                              method: "DELETE",
                              credentials: "include",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify(message),
                            }
                          );
                          dispatch(setSelectedUser(null));
                          dispatch(setSelectedGroup(targetGroup));
                          dispatch(setNotificationToggle());
                        }}
                      >
                        <Typography variant="body1" fontWeight={500}>
                          {targetGroup
                            ? targetGroup.groupName
                            : "Unknown Group"}
                        </Typography>
                        {message.text && (
                          <Typography variant="body2" color="green" mt={0.5}>
                            {message.text}
                          </Typography>
                        )}
                        {message.image.cloud_url && <p>image</p>}
                        {message.createdAt && (
                          <Typography variant="caption" color="gray" mt={0.5}>
                            {new Date(message.createdAt).toLocaleString()}
                          </Typography>
                        )}
                      </Box>

                      <img
                        src={targetGroup?targetGroup.groupIcon.cloud_url:""}
                        height="60"
                        width="60"
                        alt="Notification"
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                      />
                    </Box>
                  </>
                );
              }
            })
          ) : (
            <Typography variant="body2" align="center" color="gray">
              No new notifications
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
}

export default NotificationPanel;
