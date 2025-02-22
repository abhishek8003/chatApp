const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const User = require("./models/users");
const app = express();
const http_server = http.createServer(app);
const io_server = new Server(http_server, {
    cors: { origin: `${process.env.frontendURL}` },
    maxHttpBufferSize: 1e8
});

let online_users = [];

io_server.on("connection", (clientSocket) => {
    console.log("A user joined with Socket id:", clientSocket.id);

    let user = JSON.parse(clientSocket.handshake.query.user);
    user.socketId = clientSocket.id;
    if (user) {
        online_users = [...online_users, user];
    }
    console.log(`new online users :`, online_users);
    io_server.emit("getOnlineUsers", online_users);

    clientSocket.on("deleteOnlineUser", (data) => {
        console.log(data);

        online_users = online_users.filter((u) => u._id !== data._id);
        io_server.emit("getOnlineUsers", online_users);
    });
    clientSocket.on("sendFriend",async(data)=>{
        console.log(data);
        let onlineUsersIds=online_users.map(e=>e._id);
        let newFriend=await User.findById(data.newFriend);
        data.target.forEach((target)=>{
            if(onlineUsersIds.includes(target._id)){
                let targetUserWithSocket=online_users.find((e)=>{
                    if(e._id==target._id){
                        return e;
                    }
                });
                console.log(targetUserWithSocket.socketId);
                targetSocketId=targetUserWithSocket.socketId;
                io_server.to(targetSocketId).emit("addFriend",newFriend);
            }
        })
        
    });
    clientSocket.on("fetchAllUsers", async () => {
        let allUsers = await User.find({
            _id: { $ne: user._id }
        });
        console.log(allUsers);
        
        clientSocket.emit("getAllUsersExceptMe", allUsers);
    });
    clientSocket.on("sendMessage", async(messageBody) => {
        console.log("messageBOdy", messageBody);
        console.log("onlineUSersss", online_users.length);
        if (online_users.find((u) => {
            if (u._id == messageBody.recieverId) { return u; }
        }
        )) {
            console.log("Liivng message");
            const reciever=online_users.find((r) => {
                if (r._id == messageBody.recieverId) {
                    return r;
                }
            });
            // let sender=await User.findById(messageBody.senderId);

            io_server.to(reciever.socketId).emit("recieveMessageLive", {
                createdAt:new Date(Date.now()),
                senderId: messageBody.senderId,
                recieverId: messageBody.recieverId,
                text: messageBody.message_text,
                image: messageBody.message_image
            });
            io_server.to(reciever.socketId).emit("addNotification", {
                createdAt:new Date(Date.now()),
                senderId: messageBody.senderId,
                recieverId: messageBody.recieverId,
                text: messageBody.message_text,
                image: messageBody.message_image
            });
        }
    });

    clientSocket.on("disconnect", () => {
        console.log("A user disconnected with Socket id:", clientSocket.id);
        online_users = online_users.filter((u) => u !== user);
        io_server.emit("getOnlineUsers", online_users);
    });
});

module.exports = { http_server, app, io_server };
