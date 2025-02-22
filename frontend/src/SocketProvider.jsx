import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./redux/features/onlineUsers";
import { addNewUser, setUsers, updateOneUser } from "./redux/features/users";
import { updateChats } from "./redux/features/Chats";
import { backendContext } from "./BackendProvider";
import { updateSelectedUser } from "./redux/features/selectedUser";
import { addFriends, addNewFriend } from "./redux/features/friends";
import { addNotification } from "./redux/features/notifications";

const socketContext = createContext();

function SocketProvider({ children }) {
  const dispatch = useDispatch();
  let backendUrl = useContext(backendContext);
  const userAuth = useSelector((store) => store.userAuth);
  const [clientSocket, setClientSocket] = useState(null);
  let selectedUser = useSelector((store) => store.selectedUser);
  let isLoggedIn = !!userAuth;

  const notificationSound = useRef(new Audio("/notificationSound.mp3"));

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
        console.log("online:");
        console.log(onlineUsers);
        dispatch(setOnlineUsers(onlineUsers));
      });

      socket.on("addFriend", (data) => {
        console.log("new friend without reload:", data);
        dispatch(addNewFriend(data));
      });

      return () => {
        console.log("socket requested disconnection!");
        socket.disconnect();
      };
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (selectedUser && clientSocket) {
      clientSocket.on("recieveMessageLive", (newMessage) => {
        if (selectedUser._id === newMessage.senderId.toString()) {
          console.log("received new message");
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
        console.log("PROFILE UPDATED");
        dispatch(updateOneUser(data));
        if (selectedUser._id === data._id) {
          dispatch(updateSelectedUser(data));
        }
      });
    }

    if (clientSocket) {
      clientSocket.on("addNotification", (message) => {
        console.log(message);
        dispatch(addNotification(message));

        const playSound = async () => {
          try {
            await notificationSound.current.play();
          } catch (error) {
            console.error("Audio play failed:", error);
          }
        };

        playSound();
      });
    }

    return () => {
      if (clientSocket) {
        clientSocket.off("recieveMessageLive");
        clientSocket.off("addNotification");
      }
    };
  }, [selectedUser, clientSocket]);

  return (
    <socketContext.Provider value={clientSocket}>
      {children}
    </socketContext.Provider>
  );
}

export { socketContext };
export default SocketProvider;
