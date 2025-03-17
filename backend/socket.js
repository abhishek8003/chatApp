const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const User = require("./models/users");
const Group = require("./models/group")
const app = express();
const http_server = http.createServer(app);
const io_server = new Server(http_server, {
    cors: { origin: `${process.env.frontendURL}` },
    maxHttpBufferSize: 1e8,
    // pingTimeout: 10000, // Wait 10s before disconnecting
    // pingInterval: 5000, // Send pings every 5s   
});
const ChatNotification = require("./models/chatNotification")
const GroupNotification = require("./models/groupNotification");
const Message = require("./models/messages");

let online_users = [];

io_server.on("connection", (clientSocket) => {
    console.log("A user joined with Socket id:", clientSocket.id);

    let user = JSON.parse(clientSocket.handshake.query.user);
    if (user) {
        user.socketId = clientSocket.id;
    }
    console.log("TEST online users:", online_users);
    let alreadyExists = online_users.find((e) => {
        if (e._id == user._id) {
            return true;
        }
        return false;
    })
    if (!alreadyExists) {
    }
    online_users.push(user);
    console.log(`new online users :`, online_users);
    io_server.emit("getOnlineUsers", online_users);
    clientSocket.on("keepAlive", (d,callback) => {
        console.log(`Received keepAlive from ${clientSocket.id}`);
        if (callback) {
            callback(); // This triggers the client's callback function.
          }
    });
    clientSocket.on("deleteOnlineUser", (data) => {
        console.log(data);

        online_users = online_users.filter((u) => u._id !== data._id);
        io_server.emit("getOnlineUsers", online_users);
    });
    clientSocket.on("sendFriend", async (data) => {
        console.log(data);
        let targetSocketId;
        let onlineUsersIds = online_users.map(e => e._id);
        let newFriend = await User.findById(data.newFriend);
        data.target.forEach((target) => {
            if (onlineUsersIds.includes(target._id)) {
                let targetUserWithSocket = online_users.find((e) => {
                    if (e._id == target._id) {
                        return e;
                    }
                });
                console.log(targetUserWithSocket.socketId);
                targetSocketId = targetUserWithSocket.socketId;
                io_server.to(targetSocketId).emit("addFriend", newFriend);
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
    clientSocket.on("sendMessage", async (messageBody) => {
        console.log("messageBOdy", messageBody);
        console.log("onlineUSersss", online_users.length);
        console.log("MESSAGE TIME:", messageBody.createdAt);

        if (online_users.find((u) => {
            if (u._id == messageBody.recieverId) { return u; }
        }
        )) {
            console.log("Liivng message");
            const reciever = online_users.find((r) => {
                if (r._id == messageBody.recieverId) {
                    return r;
                }
            });
            // let sender=await User.findById(messageBody.senderId);

            io_server.to(reciever.socketId).emit("recieveMessageLive", {
                senderId: messageBody.senderId,
                receiverId: messageBody.recieverId,
                text: messageBody.message_text,
                image: messageBody.message_image,
                isGroupChat: false,
                status: "sent",
                createdAt: messageBody.createdAt,
            });
            clientSocket.emit("messageSent", {
                createdAt: messageBody.createdAt,
                senderId: messageBody.senderId,
                receiverId: messageBody.recieverId,
                text: messageBody.message_text,
                image: messageBody.message_image,
                isGroupChat: false,
                status: "sent"
            });
            io_server.to(reciever.socketId).emit("addNotification", {
                createdAt: new Date(Date.now()),
                senderId: messageBody.senderId,
                recieverId: messageBody.recieverId,
                text: messageBody.message_text,
                image: messageBody.message_image,
                isGroupChat: false
            });
        }
    });

    clientSocket.on("messagesSeenByUser", async (Targetuser) => {
        console.log("MESSAGES GOT SEEN");
        let sender;
        try {
            sender = JSON.parse(clientSocket.handshake.query.user);
        } catch (error) {
            console.error("Error parsing user:", error);
            return;
        }
        let senderId = sender._id;
        let receiverId = Targetuser._id;
        console.log("senderId:", senderId);
        console.log("receiverId:", receiverId);
        // Check if receiver is online
        let receiverWithSocket = online_users.find(r => r._id == receiverId);
        if (receiverWithSocket) {
            let socket = receiverWithSocket.socketId;
            io_server.to(socket).emit("allMesssagesReaded", {
                senderId: senderId,
                isGroupChat: false,
                status: "seen"
            });
        }
    });
    clientSocket.on("joinGroups", (data) => {
        console.log("group to be joined:", data.groups);

        let user = JSON.parse(clientSocket.handshake.query.user);
        console.log("Requesting User who wanna join a group:", user);
        let userWithSocket = online_users.find((e) => e._id === user._id);

        if (!userWithSocket) {
            console.log("User not found in online users:", user._id);
            return;
        }

        let socketID = userWithSocket.socketId;
        let socket = io_server.sockets.sockets.get(socketID);

        if (socket) {
            data.groups.forEach((g) => {
                if (!g.pastMembers?.includes(user._id)) {
                    console.log(`User ${user._id} joining group: ${g._id}`);
                    socket.join(g._id);
                }
                else {
                    console.log("Fuck u");

                }
                // console.log(`User ${user._id} joining group: ${g._id}`);
                // socket.join(g._id);
            });
        } else {
            console.log("Socket not found for user:", user._id);
        }
    });
    clientSocket.on("joinGroupWithID", (data) => {
        console.log("group to be joined:", data.group);
        let user = JSON.parse(clientSocket.handshake.query.user);
        console.log("Requesting User who wanna join a group:", user);
        let userWithSocket = online_users.find((e) => e._id === user._id);
        if (!userWithSocket) {
            console.log("User not found in online users:", user._id);
            return;
        }
        let socketID = userWithSocket.socketId;
        let socket = io_server.sockets.sockets.get(socketID);
        if (socket) {
            console.log(`User ${user._id} joining group: ${data.group._id}`);
            socket.join(data.group._id);
        } else {
            console.log("Socket not found for user:", user._id);
        }
    });

    clientSocket.on("addedNewGroup", (data) => {
        console.log(data.newGroup);
        let newGroup = data.newGroup;
        let newGroupMembers = data.newGroup.groupMembers
        let recievers = online_users.filter((onlineUser) => {
            if (
                newGroupMembers.find((e) => {
                    if (e._id == onlineUser._id) {
                        return true;
                    }
                })) {
                return onlineUser;
            }
        });
        console.log("Online recivers:", recievers);
        let receiverSocketIDs = [];
        recievers.forEach((e) => {
            receiverSocketIDs.push(e.socketId)
        });
        console.log(receiverSocketIDs);

        let roomID = newGroup._id;
        receiverSocketIDs.forEach((socketID) => {
            let socket = io_server.sockets.sockets.get(socketID);
            if (socket) {
                socket.join(roomID); // Join the room
            }
        });
        // Emit the event to the room
        io_server.to(roomID).emit("createNewGroup", { newGroup: data.newGroup });
    });
    clientSocket.on("addGroupMessage", async (data) => {
        let user = JSON.parse(clientSocket.handshake.query.user);
        let completeUser = online_users.find((u) => { if (u._id == user._id) { return true } });
        console.log(data.messageBody);
        console.log(data.selectedGroup);
        let roomID = data.selectedGroup;
        if (completeUser) {
            io_server.to(roomID).emit("recieveGroupMessageLive", {
                isGroupChat: true,
                senderId: completeUser,
                receiverId: roomID,
                text: data.messageBody.messageText,
                image: {
                    local_url: '',
                    cloud_url: data.messageBody.messageImage,
                    public_id: '',
                },
                createdAt: new Date(Date.now())
            });
            io_server.to(roomID).emit("addGroupNotification", {
                isGroupChat: true,
                senderId: user._id,
                receiverId: roomID,
                text: data.messageBody.messageText,
                image: {
                    local_url: '',
                    cloud_url: data.messageBody.messageImage,
                    public_id: '',
                }
            })

        }
    })
    clientSocket.on("memberKick", async (info) => {
        let targetMemberEmail = info.memberEmail;
        let targetGroupId = info.groupId;
        let roomId = targetGroupId;
        // let targetGroup=await Group.findById(targetGroupId);

        console.log("room ID:", roomId);
        console.log("target GROUP:", targetGroupId);
        let targetMemberWithSocket = online_users.find((e) => e.email.toString() === targetMemberEmail.toString());
        console.log(targetMemberWithSocket)
        // Notify all members in the group


        if (targetMemberWithSocket) {
            let socket = io_server.sockets.sockets.get(targetMemberWithSocket.socketId);

            io_server.emit("gotKickedFromGroup", {
                groupId: targetGroupId,
                member: targetMemberWithSocket
            });
            if (socket) {
                await new Promise((resolve, reject) => {
                    socket.leave(roomId, () => {
                        resolve();
                    })
                })
                console.log(`User ${targetMemberWithSocket._id} wtih socket ID ${targetMemberWithSocket.socketId} removed from group ${targetGroupId}`);
                if (!socket.rooms.has(roomId)) {
                    console.log(`User ${targetMemberWithSocket._id} successfully left room ${targetGroupId}`);
                } else {
                    console.log(`User ${targetMemberWithSocket._id} is still in room ${targetGroupId}`);
                }

            } else {
                let user = await Users.find({ email: targetMemberEmail });
                console.log(`Socket not found for user ${user._id}`);
                throw new Error("socket not found!");
            }

        } else {
            let user = await Users.find({ email: targetMemberEmail });
            console.log(`User ${user._id} is not online.`);
        }
    });

    clientSocket.on("memberAdd", async (data) => {
        console.log(data.groupId);
        console.log(data.members);

        let targetMembersIDs = data.members.map((e) => e._id);

        let targetMembersWithSocket = online_users.filter((e) =>
            targetMembersIDs.includes(e._id.toString())
        );
        console.log("Online members:", targetMembersWithSocket);
        let socketIDs = targetMembersWithSocket.map((e) => e.socketId)
        console.log("Socket Ids:", socketIDs);
        let targetGroup = await Group.findById(data.groupId);

        clientSocket.broadcast.to(socketIDs).emit("gotAddedToGroup", {
            group: targetGroup,
            member: targetMembersIDs
        });
    });

    clientSocket.on("disconnect", () => {
        console.log("A user disconnected with Socket id:", clientSocket.id);
        online_users = online_users.filter((u) => u._id !== user._id);
        io_server.emit("getOnlineUsers", online_users);
    });
});

module.exports = { http_server, app, io_server };
