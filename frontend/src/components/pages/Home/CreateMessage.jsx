import { Box, Button, TextField } from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollectionsIcon from "@mui/icons-material/Collections";
import SendIcon from "@mui/icons-material/Send";
import { setChats, updateChats } from "../../../redux/features/Chats";
import toast from "react-hot-toast";
import { socketContext } from "../../../SocketProvider";
import { backendContext } from "../../../BackendProvider";
import { setGroupChat } from "../../../redux/features/groupChats";
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

  let [preview, setPreview] = useState(false);
  let [previewUrl, setPreviewUrl] = useState("");
  let [messageText, setMessageText] = useState("");
  let [isSendingMessage, setSendingMessage] = useState(false);
  let userAuth = useSelector((store) => {
    return store.userAuth;
  });
  let dispatch = useDispatch();
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
        })
      );

      clientSocket.emit("sendMessage", {
        senderId: userAuth._id,
        recieverId: selectedUser._id,
        message_text: text,
        message_image: imgTempUrl,
      });
      setPreview(false);
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
          console.log(json.newMessage);
          // dispatch(setChats([...chats, json.newMessage]));
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
    if (selectedGroup) {
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
        clientSocket.emit("addGroupMessage",{
          selectedGroup:selectedGroup._id,
          messageBody:{
            messageText:text,
            messageImage:previewUrl
          }
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
