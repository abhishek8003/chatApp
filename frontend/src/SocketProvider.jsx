import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./redux/features/onlineUsers";
import { addNewUser, setUsers, updateOneUser } from "./redux/features/users";
import { updateChats } from "./redux/features/Chats";
import { backendContext } from "./BackendProvider";
import { updateSelectedUser } from "./redux/features/selectedUser";

const socketContext = createContext();

function SocketProvider({ children }) {
  const dispatch = useDispatch();
  let backendUrl = useContext(backendContext);
  const userAuth = useSelector((store) => store.userAuth);
  const [clientSocket, setClientSocket] = useState(null);
  let selectedUser = useSelector((store) => {
    return store.selectedUser;
  });
  let allUsers = useSelector((store) => {
    return store.users;
  });
  let isLoggedIn = !!userAuth;
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
      
      return () => {
        console.log("socket requested disconnection!");
        socket.disconnect();
      };
    }
  }, [isLoggedIn]);
  useEffect(() => {
    if (selectedUser && clientSocket) {
      clientSocket.on("recieveMessageLive", (newMessage) => {
        console.log(selectedUser._id);
        console.log(newMessage.senderId.toString());
        console.log(newMessage.image);
        console.log(
          `compare`,
          selectedUser._id == newMessage.senderId.toString()
        );
        if (selectedUser._id == newMessage.senderId.toString()) {
          console.log("recieved new message");
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
        console.log("PROFILE UPLADTEd");
        console.log(data);
        dispatch(updateOneUser(data));
        if(selectedUser._id==data._id){
          dispatch(updateSelectedUser(data));
        }
      });
    }
    return () => {
      if (clientSocket) {
        clientSocket.off("recieveMessageLive"); // Clean up the listener
        // Clean up the listener
      }
    };
  }, [selectedUser]);
  
  return (
    <socketContext.Provider value={clientSocket}>
      {children}
    </socketContext.Provider>
  );
}

export { socketContext };
export default SocketProvider;
