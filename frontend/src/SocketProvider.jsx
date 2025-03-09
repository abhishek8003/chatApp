import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./redux/features/onlineUsers";
import { addNewUser, setUsers, updateOneUser } from "./redux/features/users";
import { updateChats } from "./redux/features/Chats";
import { backendContext } from "./BackendProvider";
import { updateSelectedUser } from "./redux/features/selectedUser";
import {
  addFriends,
  addNewFriend,
  updateFriends,
} from "./redux/features/friends";
import { addNotification } from "./redux/features/notifications";
import {
  addGroup,
  addMemberInGroups,
  removeMemberFromGroups,
} from "./redux/features/groups";
import {
  addMemberInGroupChat,
  removeMemberFromGroupChat,
  setGroupChat,
  updateGroupChat,
} from "./redux/features/groupChats";
import {
  addMemberInSelectedGroup,
  removeMemberFromSelectedGroup,
} from "./redux/features/selectedGroup";
import { removegroupCurrentMembers } from "./redux/features/groupCurrentMembers";
import { addgroupPastMembers } from "./redux/features/groupPastMembers";

const socketContext = createContext();

function SocketProvider({ children }) {
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

  // Initialize socket connection
  useEffect(() => {
    if (isLoggedIn) {
      const socket = io(backendUrl, {
        query: { user: JSON.stringify(userAuth) },
      });

      setClientSocket(socket);

      socket.on("connect", () => {
        console.log("Connected to socket server");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
        setClientSocket(null);
      });

      socket.on("newUserRegistered", (newUser) => {
        dispatch(addNewUser(newUser));
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      socket.on("getOnlineUsers", (onlineUsers) => {
        console.log("Online users:", onlineUsers);
        dispatch(setOnlineUsers(onlineUsers));
      });

      socket.on("addFriend", (data) => {
        console.log("New friend without reload:", data);
        dispatch(addNewFriend(data));
      });

      socket.on("createNewGroup", (data) => {
        console.log("New group created:", data.newGroup);
        dispatch(addGroup(data.newGroup));
      });

      // Cleanup on unmount
      return () => {
        console.log("Socket requested disconnection!");
        socket.disconnect();
      };
    }
  }, [isLoggedIn, backendUrl, userAuth, dispatch]);

  useEffect(() => {
    if (!clientSocket) {
      return;
    }
    clientSocket.on("gotKickedFromGroup", (data) => {
      // if (selectedGroup?._id === data.groupId.toString() && clientSocket) {
      if (clientSocket) {
        console.log(data.groupId);
        console.log(data.memberId);
        dispatch(removeMemberFromGroups(data)); //we just sending group ID and member ID
        dispatch(removeMemberFromGroupChat(data)); //we just sending group ID and member ID
        dispatch(removeMemberFromSelectedGroup(data)); ////we just sending group ID and member ID
        let targetMember = users.find((e) => {
          if (e._id == data.memberId) {
            return true;
          }
        });
        if (!targetMember) {
          if (userAuth._id == data.memberId) {
            targetMember = userAuth;
          }
        }
        dispatch(removegroupCurrentMembers(targetMember));
        dispatch(addgroupPastMembers(targetMember));
      }
    });
    clientSocket.on("gotAddedToGroup", (data) => {
      if (clientSocket) {
        console.log("You were added to Group:", data.group);
        console.log("Your details:", data.member);
        dispatch(
          addMemberInGroups({
            groupId: data.group_id,
            member: userAuth,
          })
        ); //we just sending group ID and member ID
        dispatch(
          addMemberInGroupChat({
            groupId: data.group_id,
            member: userAuth,
          })
        );
        dispatch(
          addMemberInSelectedGroup({
            groupId: data.group_id,
            member: userAuth,
          })
        );
        console.log("selectedGroup:", selectedGroup);
        console.log("groupChat:", groupChat);
        console.log("groups:", groups);
        clientSocket.emit("joinGroupWithID", { group: data.group });
      }
    });
  }, [userAuth, users, selectedGroup,groups,groupChat]);
  // Handle live messages and notifications
  useEffect(() => {
    if (!clientSocket) return;

    clientSocket.on("recieveMessageLive", (newMessage) => {
      if (selectedUser?._id === newMessage.senderId.toString()) {
        console.log("Received new message");
        dispatch(
          updateChats({
            senderId: newMessage.senderId,
            receiverId: newMessage.receiverId,
            text: newMessage.text,
            image: {
              local_url: "",
              cloud_url: newMessage.image ? newMessage.image : null,
            },
          })
        );
      }
    });

    clientSocket.on("profileUpdated", (data) => {
      console.log("Profile updated:", data);
      dispatch(updateOneUser(data));
      if (selectedUser?._id === data._id) {
        dispatch(updateSelectedUser(data));
      }
      dispatch(updateFriends(data));
    });

    clientSocket.on("addNotification", async (message) => {
      if (selectedUser && message.senderId == selectedUser._id) {
        console.log(message.senderId);
        console.log(selectedUser._id);
        notificationSound.current.play().catch((error) => {
          console.error("Audio play failed:", error);
        });
        return;
      }

      dispatch(addNotification(message));
      console.log("New notification:", message);
      let response = fetch(`${backendUrl}/api/notifications/${userAuth._id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
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
  }, [clientSocket, selectedUser, dispatch, userAuth]);

  // Handle group messages
  useEffect(() => {
    if (!clientSocket) return;

    clientSocket.on("recieveGroupMessageLive", (data) => {
      if (selectedGroup?._id === data.receiverId.toString()) {
        console.log("Received group message:", data);
        dispatch(updateGroupChat(data));
      }
    });
    clientSocket.on("addGroupNotification", (message) => {
      if (selectedGroup && message.receiverId == selectedGroup._id) {
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
  }, [clientSocket, userAuth, groups]);

  return (
    <socketContext.Provider value={clientSocket}>
      {children}
    </socketContext.Provider>
  );
}

export { socketContext };
export default SocketProvider;
