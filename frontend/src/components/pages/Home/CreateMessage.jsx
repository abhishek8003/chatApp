import { Box, Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollectionsIcon from "@mui/icons-material/Collections";
import SendIcon from "@mui/icons-material/Send";
import {
  changeStatus,
  setChats,
  updateChats,
} from "../../../redux/features/Chats";
import toast from "react-hot-toast";
import { socketContext } from "../../../SocketProvider";
import { backendContext } from "../../../BackendProvider";
import { setGroupChat } from "../../../redux/features/groupChats";
import { uploadingToggle } from "../../../redux/features/uploading";
import { setKeepAliveInterval } from "../../../redux/features/keepAliveInterval";
function CreateMessage() {
  let selectedGroup = useSelector((store) => {
    return store.selectedGroup;
  });
  let backendUrl = useContext(backendContext);
  let selectedUser = useSelector((store) => {
    return store.selectedUser;
  });
  let inputFile = useRef();
  let clientSocket = useContext(socketContext);
  let chats = useSelector((store) => {
    return store.chats;
  });
  let onlineUsers = useSelector((store) => {
    return store.onlineUsers;
  });
  let [preview, setPreview] = useState(false);
  let keepAliveInterval = useSelector((store) => store.keepAliveInterval);
  let [previewUrl, setPreviewUrl] = useState("");
  let [messageText, setMessageText] = useState("");
  let [isSendingMessage, setSendingMessage] = useState(false);
  let uploading = useSelector((store) => store.uploading);
  let userAuth = useSelector((store) => {
    return store.userAuth;
  });
  let dispatch = useDispatch();
  let keepAliveIntervalRef = useRef(null); // ✅ Create a ref
  useEffect(() => {
    keepAliveIntervalRef.current = keepAliveInterval; // ✅ Always update ref when Redux value changes
  }, [keepAliveInterval]);
  let handleFilePreview = () => {
    setPreview(true);
    if (inputFile) {
      let fileObj = inputFile.current.files[0];
      let fileReader = new FileReader();
      fileReader.addEventListener("loadend", (e) => {
        console.log(e.target.result);
        setPreviewUrl(e.target.result);
      });
      fileReader.readAsDataURL(fileObj);
    }
  };

  let form = useRef();
  let handleSendMessage = async (myForm) => {
    setSendingMessage(true);
    const time = new Date(Date.now()).toISOString(); // Set time once
    let text = myForm.newMessage.value;
    let imgTempUrl = previewUrl;

    if (selectedUser) {
      dispatch(
        updateChats({
          senderId: userAuth._id,
          receiverId: selectedUser._id,
          text: text,
          image: {
            local_url: "",
            cloud_url: imgTempUrl,
          },
          createdAt: time,
          status: "pending",
          isGroupChat: false,
        })
      );
      dispatch(uploadingToggle(true)); //make uploading true
      setTimeout(() => {
        clientSocket?.emit("sendMessage", {
          senderId: userAuth._id,
          recieverId: selectedUser._id,
          message_text: text,
          message_image: imgTempUrl,
          createdAt: time,
        });
      }, 1);
      console.log("am after setTImeout");
      
      // dispatch(
      //   changeStatus({
      //     senderId: userAuth._id,
      //     receiverId: selectedUser._id,
      //     text: text,
      //     image: {
      //       local_url: "",
      //       cloud_url: imgTempUrl,
      //     },
      //     createdAt: time,
      //     status: "sent",
      //   })
      // );
      console.log(`logged socket after emiting:`, clientSocket);

      let file = myForm.messageFile && myForm.messageFile.files[0];
      console.log(text);
      console.log(file);
      if (!text && !file) {
        return;
      }
      let formData = new FormData();
      if (text) {
        formData.append("messageText", text);
      }
      if (file) {
        formData.append("messageImage", file);
      }
      formData.append("messageTime", time);
      setPreview(false);
      setMessageText("");
      inputFile.current.value = "";
      try {
        let response = await fetch(
          `${backendUrl}/api/chats/${selectedUser._id}`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
        let json = await response.json();
        if (response.status === 200) {
          console.log("After saving to database:", json.newMessage);
          // dispatch(setChats([...chats, json.newMessage]));
          // setMessageText("");
          // inputFile.current.value = "";
          // setPreview(false);
          // console.log("Clearing interval:", keepAliveIntervalRef.current);
          // clearInterval(keepAliveIntervalRef.current);
          // dispatch(setKeepAliveInterval(null));
          let receiverStatus = onlineUsers.find((u) => {
            if (u._id == json.newMessage.receiverId) {
              return true;
            }
            return false;
          });
          if (!receiverStatus) {
            dispatch(changeStatus(json.newMessage));
          }

          setSendingMessage(false);
          setPreviewUrl(null);
        }
      } catch (error) {
        console.log(error);
        toast.error(error);
      } finally {
        setSendingMessage(false);
      }
    }
    if (selectedGroup) {
      try {
        if (selectedGroup.pastMembers.includes(userAuth._id)) {
          // alert("BRO Its not member!")
          console.log("BUG selected Group:", selectedGroup);
          throw new Error("You are not a member of this group");
        } else {
          console.log("TEST selected Group:", selectedGroup);
        }
      } catch (error) {
        toast.error(error.message);
        setMessageText("");
        inputFile.current.value = "";
        setSendingMessage(false);
        setPreview(false);
        setPreviewUrl(null);
        return;
      }
      // alert("BRO !")

      let file = myForm.messageFile && myForm.messageFile.files[0];
      console.log(text);
      console.log(file);
      if (!text && !file) {
        return;
      }
      let formData = new FormData();
      if (text) {
        formData.append("messageText", text);
      }
      if (file) {
        formData.append("messageImage", file);
      }
      try {
        clientSocket?.emit("addGroupMessage", {
          selectedGroup: selectedGroup._id,
          messageBody: {
            messageText: text,
            messageImage: previewUrl,
            createdAt: new Date(Date.now()),
          },
        });
        let response = await fetch(
          `${backendUrl}/api/groups/group/${selectedGroup._id}/message`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
        let json = await response.json();
        if (response.status === 200) {
          console.log(json.group);
          dispatch(setGroupChat(json.group));
          setMessageText("");
          inputFile.current.value = "";
          setSendingMessage(false);
          setPreview(false);
          setPreviewUrl(null);
        }
      } catch (error) {
        console.log(error);
        toast.error(error);
      } finally {
        setSendingMessage(false);
      }
    }
  };
  useEffect(() => {
    if (chats && selectedUser) {
      let targetChats = chats.filter((c) => {
        if (
          c.senderId == userAuth._id &&
          c.receiverId == selectedUser._id &&
          c.status == "sent"
        ) {
          return true;
        }
        return false;
      });
      let targetChats2 = chats.filter((c) => {
        if (
          c.senderId == userAuth._id &&
          c.receiverId == selectedUser._id &&
          c.status == "delivered"
        ) {
          return true;
        }
        return false;
      });
      console.log("THEY GOT BROKE", targetChats);
      let receiverStatus = onlineUsers.find((e) => {
        if (e._id == selectedUser._id) {
          return true;
        }
        return false;
      });
      if (!receiverStatus) {
        targetChats.forEach((chat) => {
          dispatch(changeStatus({ ...chat, status: "delivered" })); //jbb offline hoga
        });
      }
      if (receiverStatus) {
        targetChats2.forEach((chat) => {
          dispatch(changeStatus({ ...chat, status: "sent" })); //jb online hoga
        });
      }
    }
  }, [onlineUsers, selectedUser]);
  return (
    <>
      <Box sx={{ width: "fit-content" }}>
        {preview && inputFile.current && inputFile.current.files[0] ? (
          <>
            <div style={{ position: "absolute", bottom: "80px", left: "10px" }}>
              <img src={previewUrl} height={"100px"} width={"100px"}></img>
              <i
                onClick={() => {
                  (inputFile.current.value = ""), setPreview(null);
                  setPreviewUrl(null);
                }}
                class="fa-solid fa-square-xmark"
                style={{
                  position: "absolute",
                  right: "-11px",
                  top: "-11px",
                  fontSize: "1.25rem",
                  color: "red",
                }}
              ></i>
            </div>
          </>
        ) : (
          ""
        )}
      </Box>
      <form
        ref={form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(form.current);
        }}
      >
        <div
          style={{
            minHeight: "70px",
            width: "100%",
            border: "",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Type a message..."
            autoComplete="off"
            value={messageText}
            name="newMessage"
            onChange={(e) => {
              setMessageText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (!(messageText.length > 0 || preview)) {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevent form submission
                }
              }
            }}
            sx={{ flexGrow: "1", border: "" }}
          ></TextField>
          <Box
            style={{
              width: "fit-content",
              //   border:"2px solid red",

              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
            sx={{
              "& svg": {
                height: "56px",
                margin: "0px 0.4rem",
                fontSize: "2.2rem",
              },
            }}
          >
            <label for="messageFile">
              <CollectionsIcon></CollectionsIcon>
            </label>
            <input
              type="file"
              ref={inputFile}
              id="messageFile"
              name="messageFile"
              onChange={() => {
                handleFilePreview();
                document.querySelector('input[name="newMessage"]').focus();
              }}
              style={{ display: "none" }}
            ></input>
            <label>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  form.current.requestSubmit();
                }}
                disabled={
                  (messageText.length > 0 || preview ? false : true) ||
                  isSendingMessage
                }
              >
                <SendIcon></SendIcon>
              </Button>
            </label>
          </Box>
        </div>
      </form>
    </>
  );
}

export default CreateMessage;
