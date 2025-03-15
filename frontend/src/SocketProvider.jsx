import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./redux/features/onlineUsers";
import { addNewUser, updateOneUser } from "./redux/features/users";
import {
  changeStatus,
  changeStatusOfAll,
  updateChats,
} from "./redux/features/Chats";
import { backendContext } from "./BackendProvider";
import {
  updateSelectedUser,
} from "./redux/features/selectedUser";
import { addNewFriend } from "./redux/features/friends";
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
import {
  addgroupCurrentMembers,
  removegroupCurrentMembers,
} from "./redux/features/groupCurrentMembers";
import {
  addgroupPastMembers,
  removegroupPastMembers,
} from "./redux/features/groupPastMembers";
import toast from "react-hot-toast";
import { uploadingToggle } from "./redux/features/uploading";

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
  const isInitialConnect = useRef(true);
  const uploading = useSelector((store) => store.uploading);

  // Keep the keepAlive interval ID in a ref so we can clear it later
  const keepAliveIntervalRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn) {
      const socket = io(backendUrl, {
        query: { user: JSON.stringify(userAuth) },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });

      setClientSocket(socket);

      socket.on("connect", () => {
        console.log("Connected to socket server");
        socket.on("getOnlineUsers", (onlineUsers) => {
          console.log("Online users:", onlineUsers);
          dispatch(setOnlineUsers(onlineUsers));
        });
        if (!isInitialConnect.current) {
          toast.success("Reconnected!");
          window.location.reload();
        }
        isInitialConnect.current = false;
      });

      socket.on("disconnect", (reason) => {
        console.log(`Disconnected: ${reason}`);
        toast.error("Connection lost! Trying to reconnect...");
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        toast.error("Unable to connect to server! Retrying...");
      });
      socket.on("reconnect_attempt", () => console.log("Attempting to reconnect..."));
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

      // Establish an independent keepAlive interval
      keepAliveIntervalRef.current = setInterval(() => {
        console.log("FIRING KEEP ALIVE!");
        socket.emit("keepAlive");
      }, 2000);

      socket.on("createNewGroup", (data) => {
        console.log("New group created:", data.newGroup);
        dispatch(addGroup(data.newGroup));
      });

      return () => {
        clearInterval(keepAliveIntervalRef.current);
        socket.off("getOnlineUsers");
        socket.off("createNewGroup");
        socket.off("addFriend");
        socket.off("newUserRegistered");
        console.log("Socket requested disconnection!");
        socket.disconnect();
      };
    }
  }, [isLoggedIn, backendUrl, userAuth, dispatch]);

  // (Other event listeners remain as before.)

  useEffect(() => {
    if (!clientSocket) return;
    clientSocket.on("messageSent", (message) => {
      console.log("Message sent successfully:", message);
      dispatch(changeStatus(message));
      dispatch(uploadingToggle(false));
    });
  }, [clientSocket]);

  // … [Other useEffects for handling messages, notifications, etc.]

  useEffect(() => {
    if (!clientSocket || !userAuth || groups.length === 0) return;
    const prevGroups = prevGroupsRef.current;
    const addedGroups = groups.filter(
      (group) => !prevGroups.find((prev) => prev._id === group._id)
    );
    if (addedGroups.length > 0) {
      clientSocket.emit("joinGroups", { groups: addedGroups });
      prevGroupsRef.current = groups;
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
