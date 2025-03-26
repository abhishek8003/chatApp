import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./redux/features/onlineUsers";
import { addNewUser, setUsers, updateOneUser } from "./redux/features/users";
import {
  changeStatus,
  changeStatusOfAll,
  editChats,
  updateChats,
} from "./redux/features/Chats";
import { backendContext } from "./BackendProvider";
import {
  setSelectedUser,
  updateSelectedUser,
} from "./redux/features/selectedUser";
import {
  addFriends,
  addNewFriend,
  updateFriends,
} from "./redux/features/friends";
import {
  addNotification,
  deleteNotificationOfGroup,
  editNotificationOfGroup,
  editNotificationOfUser,
} from "./redux/features/notifications";
import {
  addGroup,
  addMemberInGroups,
  addNewMessageInGroups,
  removeMemberFromGroups,
} from "./redux/features/groups";
import {
  addMemberInGroupChat,
  changeGroupMessageStatus,
  editGroupChat,
  removeMemberFromGroupChat,
  setGroupChat,
  updateGroupChat,
} from "./redux/features/groupChats";
import {
  addMemberInSelectedGroup,
  addNewMessageInSelectedGroup,
  removeMemberFromSelectedGroup,
  setSelectedGroup,
} from "./redux/features/selectedGroup";
import {
  addgroupCurrentMembers,
  removegroupCurrentMembers,
} from "./redux/features/groupCurrentMembers";
import {
  addgroupPastMembers,
  removegroupPastMembers,
} from "./redux/features/groupPastMembers";
import toast from "react-hot-toast";
import { increaseRetry } from "./redux/features/retry";
import { uploadingToggle } from "./redux/features/uploading";
import { setKeepAliveInterval } from "./redux/features/keepAliveInterval";

const socketContext = createContext();

function SocketProvider({ children }) {
  // let keepAliveInterval = useRef();
  const dispatch = useDispatch();
  const groups = useSelector((store) => store.groups);
  const selectedGroup = useSelector((store) => store.selectedGroup);
  const groupChat = useSelector((store) => store.groupChat);
  const backendUrl = useContext(backendContext);
  const userAuth = useSelector((store) => store.userAuth);
  const selectedUser = useSelector((store) => store.selectedUser);
  const isLoggedIn = !!userAuth;
  const users = useSelector((store) => store.users);
  const [clientSocket, setClientSocket] = useState(null);
  const notificationSound = useRef(new Audio("/notificationSound.mp3"));
  const prevGroupsRef = useRef([]);
  const isInitialConnect = useRef(true); // Add this line
  let uploading = useSelector((store) => store.uploading);

  useEffect(() => {
    if (isLoggedIn) {
      const socket = io(backendUrl, {
        query: { user: JSON.stringify(userAuth) },
        reconnection: true, // Enables automatic reconnection
        reconnectionAttempts: Infinity, // Keep trying indefinitely
        reconnectionDelay: 3000, // Wait 3s before retrying
      });

      setClientSocket(socket);

      socket.on("connect", () => {
        console.log("Connected to socket server");
        socket.on("getOnlineUsers", (onlineUsers) => {
          console.log("Online users:", onlineUsers);
          dispatch(setOnlineUsers(onlineUsers));
        });
        if (!isInitialConnect.current) {
          // Force full page reload on reconnect
          toast.success("Reconnected!");
          window.location.reload();
        }
        isInitialConnect.current = false;
      });

      socket.on("disconnect", (reason) => {
        console.log(`Disconnected from socket server: ${reason}`);
        toast.error("Connection lost! Trying to reconnect...");
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        toast.error("Unable to connect to server! Retrying...");
      });
      socket.on("reconnect_attempt", () => {
        console.log("Attempting to reconnect...");
      });
      socket.on("reconnect_failed", () => {
        console.log("Reconnection failed.");
        toast.error("Failed to reconnect. Please check your network.");
      });
      socket.on("newUserRegistered", (newUser) => {
        dispatch(addNewUser(newUser));
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      socket.on("addFriend", (data) => {
        console.log("New friend without reload:", data);
        dispatch(addNewFriend(data));
      });

      setInterval(() => {
        console.log("FIRING KEEP ALIVE!");
        socket.emit("keepAlive");
      }, 2000); // Send every 2s

      socket.on("createNewGroup", (data) => {
        console.log("New group created:", data.newGroup);
        dispatch(addGroup(data.newGroup));
      });

      // Cleanup on unmount
      return () => {
        socket.off("getOnlineUsers");
        socket.off("createNewGroup");
        socket.off("addFriend");
        socket.off("newUserRegistered");
        console.log("Socket requested disconnection!");
        socket.disconnect();
      };
    }
  }, [isLoggedIn, backendUrl, userAuth?._id, dispatch]);
  useEffect(() => {
    if (!clientSocket) return;
    clientSocket.on("messageSent", (message) => {
      console.log("Message was sent succesfuly!:", message);
      dispatch(changeStatus(message));
      dispatch(uploadingToggle(false));
    });
  }, [clientSocket]); ///fuck

  useEffect(() => {
    if (!clientSocket) {
      return;
    }
    clientSocket.on("allMesssagesReaded", async (data) => {
      console.log("Message was readed succesfully by User ID:", data.senderId);
      let senderId = userAuth._id;
      let receiverId = data.senderId; //data.senderId is actually reciver in current user
      let isGroupChat = data.isGroupChat;
      console.log("senderId", senderId);
      console.log("receiverId:", receiverId);
      console.log("isGroupChat:", data.isGroupChat);
      dispatch(
        changeStatusOfAll({
          senderId,
          receiverId: receiverId,
          isGroupChat,
          status: data.status,
        })
      );

      const response = await fetch(
        `${backendUrl}/api/chats/${selectedUser._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: data.status }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);
    });
    return () => {
      clientSocket?.off("allMesssagesReaded");
    };
  }, [selectedUser]);
  useEffect(() => {
    if (!clientSocket) {
      return;
    }
    clientSocket.on("gotKickedFromGroup", (data) => {
      if (clientSocket) {
        console.log(data.groupId);
        console.log(data.member);
        dispatch(
          removeMemberFromSelectedGroup({
            groupId: data.groupId,
            memberId: data.member._id,
          })
        ); ////we just sending group ID and member ID
        dispatch(
          removeMemberFromGroups({
            groupId: data.groupId,
            memberId: data.member._id,
          })
        ); //we just sending group ID and member ID
        dispatch(
          removeMemberFromGroupChat({
            groupId: data.groupId,
            memberId: data.member._id,
          })
        ); //we just sending group ID and member ID

        console.log("TARGETED MEMBER POPULATED", data.member);

        dispatch(removegroupCurrentMembers(data.member));
        dispatch(addgroupPastMembers(data.member));
        console.log("updated selected GROUP without", selectedGroup);
        console.log("updated  GROUPs without", groups);
        console.log("updated  GROUP chats without", groupChat);
      }
    });
    clientSocket.on("gotAddedToGroup", async (data) => {
      // alert("You got added!");
      if (clientSocket) {
        console.log("You were added to Group:", data.group);
        console.log("Your details:", data.member);
        dispatch(
          addMemberInGroups({
            groupId: data.group._id,
            member: userAuth,
          })
        );
        dispatch(
          addMemberInGroupChat({
            groupId: data.group._id,
            member: userAuth,
          })
        );
        dispatch(
          addMemberInSelectedGroup({
            groupId: data.group._id,
            member: userAuth,
          })
        );
        dispatch(addgroupCurrentMembers(userAuth));
        dispatch(removegroupPastMembers(userAuth));
        //we just sending group ID and member ID

        clientSocket.emit("joinGroupWithID", { group: data.group });
      }
    });
  }, [userAuth?._id, users, selectedGroup, groups, groupChat]);
  // Handle live messages and notifications
  useEffect(() => {
    if (!clientSocket) return;

    clientSocket.on("recieveMessageLive", (newMessage) => {
      if (selectedUser?._id === newMessage.senderId.toString()) {
        console.log("Received new message:", newMessage);
        dispatch(
          updateChats({
            senderId: newMessage.senderId,
            isGroupChat: false,
            receiverId: newMessage.receiverId,
            text: newMessage.text,
            image: {
              local_url: "",
              cloud_url: newMessage.image ? newMessage.image : null,
            },
            createdAt: newMessage.createdAt,
          })
        );

        console.log("i will tell sender that message was reicived!");

        clientSocket.emit("messagesSeenByUser", selectedUser); //selectedUser is target user
        console.log("i  told sender that message was reicived!");
      }
    });
    clientSocket.on("recieveMessageDeleteLive", (newMessage) => {
      console.log("a message Deleted:", newMessage);
      if (selectedUser?._id === newMessage.senderId.toString()) {
        dispatch(
          editChats({
            senderId: newMessage.senderId,
            isGroupChat: false,
            receiverId: newMessage.receiverId,
            text: newMessage.text,
            image: {
              local_url: "",
              cloud_url: newMessage.image ? newMessage.image : null,
            },
            createdAt: newMessage.createdAt,
            status: newMessage.status,
          })
        );
      }
    });
    clientSocket.on("messageUpdated", (message) => {
      console.log("MESAGE got deleted UPDATED BROOOOOOOOOOOO",message);
      dispatch(editChats(message));
    });
    clientSocket.on("recieveMessageEditLive", (newMessage) => {
      console.log("a message got Edited:", newMessage);
      if (selectedUser?._id === newMessage.senderId.toString()) {
        dispatch(
          editChats({
            senderId: newMessage.senderId,
            isGroupChat: false,
            receiverId: newMessage.receiverId,
            text: newMessage.text,
            image:  newMessage.image ? newMessage.image : null,
            createdAt: newMessage.createdAt,
            status: newMessage.status,
          })
        );
      }
    });

    clientSocket.on("recieveMessageNotificationDeleteLive", (message) => {
      console.log("notification to be deleted", message);

      dispatch(editNotificationOfUser(message));
      // console.log("New notification:", message);
      // Play notification sound
      // notificationSound.current.play().catch((error) => {
      //   console.error("Audio play failed:", error);
      // });
    });
    clientSocket.on("recieveMessageNotificationEditLive", (message) => {
      console.log("notification to be deleted", message);

      dispatch(editNotificationOfUser(message));
      // console.log("New notification:", message);
      // Play notification sound
      // notificationSound.current.play().catch((error) => {
      //   console.error("Audio play failed:", error);
      // });
    });
    clientSocket.on("profileUpdated", (data) => {
      console.log("Profile updated:", data);
      dispatch(updateOneUser(data));
      if (selectedUser?._id === data?._id) {
        dispatch(updateSelectedUser(data));
      }
      dispatch(updateFriends(data));
    });

    clientSocket.on("addNotification", async (message) => {
      if (
        selectedUser &&
        message.senderId.toString() == selectedUser._id.toString()
      ) {
        console.log(message.senderId);
        console.log(selectedUser._id);
        notificationSound.current.play().catch((error) => {
          console.error("Audio play failed:", error);
        });
        return;
      }

      dispatch(addNotification(message));
      console.log("New notification:", message);

      // Play notification sound
      notificationSound.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
    });

    // Cleanup event listeners
    return () => {
      clientSocket.off("recieveMessageLive");
      clientSocket.off("profileUpdated");
      clientSocket.off("addNotification");
    };
  }, [clientSocket, selectedUser, dispatch, userAuth?._id]);

  // Handle group messages
  useEffect(() => {
    if (!clientSocket) return;

    clientSocket.on("recieveGroupMessageLive", (data) => {
      if (selectedGroup?._id === data.receiverId.toString()) {
        console.log("Received group message:", data);
        dispatch(updateGroupChat(data));
        dispatch(
          addNewMessageInSelectedGroup({ ...data, senderId: data.senderId._id })
        );
        dispatch(
          addNewMessageInGroups({ ...data, senderId: data.senderId._id })
        );
        //todo selectedGroup message push and groups message push
      }
    });
    clientSocket.on("groupMessageSent", (data) => {
      console.log("EVNR SENT");

      if (selectedGroup?._id === data.receiverId.toString()) {
        console.log(" group message was sent:", data);
        dispatch(changeGroupMessageStatus(data));
        //todo selectedGroup message push and groups message push
      }
    });

    clientSocket.on("addGroupNotification", (message) => {
      if (
        selectedGroup &&
        message.receiverId.toString() == selectedGroup._id.toString()
      ) {
        console.log(message.receiverId);
        console.log(selectedGroup._id);
        if (message.senderId == userAuth._id) {
          return;
        }
        notificationSound.current.play().catch((error) => {
          console.error("Audio play failed:", error);
        });
        return;
      }
      console.log("New notification:", message);

      dispatch(addNotification(message));
      // Play notification sound
      notificationSound.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
    });
    clientSocket.on("recieveGroupMessageDeleteLive", (message) => {
      console.log("Group message was deleted:", message);
      dispatch(editGroupChat(message));
    });
    clientSocket.on("groupMessageUpdated", (message) => {
      console.log("Group message was deleted (for sender):", message);
      dispatch(editGroupChat(message));
    });
    clientSocket.on("deleteGroupNotification", (messsage) => {
      console.log("Group Notification to be edited:", messsage);
      dispatch(editNotificationOfGroup(messsage));
    });
    // Cleanup event listener
    return () => {
      clientSocket.off("recieveGroupMessageLive");
      clientSocket.off("addGroupNotification");
    };
  }, [clientSocket, selectedGroup, groupChat, dispatch]);

  // Handle joining and leaving group rooms
  useEffect(() => {
    if (!clientSocket || !userAuth || groups.length === 0) return;

    const prevGroups = prevGroupsRef.current;
    const addedGroups = groups.filter(
      (group) => !prevGroups.find((prev) => prev._id === group._id)
    );

    if (addedGroups.length > 0) {
      console.log("Joining groups:", addedGroups);
      clientSocket.emit("joinGroups", { groups: addedGroups });
      prevGroupsRef.current = groups; // Update reference
    }
  }, [clientSocket, userAuth?._id, groups]);

  return (
    <socketContext.Provider value={clientSocket}>
      {children}
    </socketContext.Provider>
  );
}

export { socketContext };
export default SocketProvider;
