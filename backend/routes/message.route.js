const express = require("express")
const { validate_user, isAuthenticated } = require("../middlewares")
const Message = require('../models/messages');
let User = require("../models/users")
const upload_message_images = require("../storage/localConfig/messageImages");
const cloudinary = require("../storage/cloudConfig/cloud");
const { io_server } = require("../socket");
const chatNotification = require("../models/chatNotification");
const message_router = express.Router();
const gemini_ai = require("../ai-config/geminiConfig");
const { default: mongoose } = require("mongoose");
message_router.get("/:id", isAuthenticated, async (req, res, next) => {
    try {
        let senderId = req.user._id;
        let receiverId = req.params.id;

        let messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ],
            isGroupChat: false // Exclude group chats
        });
        await Message.updateMany({
            senderId: receiverId, // Only messages from the receiver
            receiverId: senderId, // Sent to the logged-in user
            status: { $ne: "seen" } // Only update unseen messages
        }, {
            $set: { status: "seen" }
        });

        res.status(200).send({ allMessages: messages });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message })

    }
});
// {senderId:userAuth._id,recieverId:selectedUser._id,message_text,message_image}
message_router.post("/:id", upload_message_images.single("messageImage"), isAuthenticated,
    async (req, res, next) => {
        try {
            let senderId = req.user._id
            let receiverId = req.params.id;
            let message_text = req.body.messageText;
            let message_time = req.body.messageTime;
            let image;
            let recieverUser = await User.findById(receiverId);
            let isrecieverUserAi = recieverUser.isAi;
            if (!isrecieverUserAi) {
                if (req.file) {
                    console.log(req.file);
                    let responseFromCloud = await cloudinary.uploader.upload(req.file.path, {
                        folder: "chatApp/messageImages"
                    });
                    console.log(responseFromCloud);
                    image = {
                        local_url: req.file.path,
                        cloud_url: responseFromCloud.url,
                        public_id: responseFromCloud.public_id
                    }
                    // image = {
                    //     local_url: req.file.path,
                    //     cloud_url: req.file.path,
                    //     public_id: ""
                    // }
                }
                console.log("MESSAGE IN DATA TIME:", message_time);
                const newMessage = new Message({
                    senderId,
                    receiverId,
                    text: message_text,
                    image: image,
                    createdAt: message_time,
                    status: "delivered"
                });
                let notification_image = image ? image.cloud_url : "";
                let notificationToBeSaved = new chatNotification({
                    createdAt: message_time,
                    senderId: senderId,
                    recieverId: receiverId,
                    text: message_text,
                    image: notification_image,
                    isGroupChat: false
                });
                try {
                    let response = await notificationToBeSaved.save();
                    console.log(response);
                }
                catch (err) {
                    console.log(err);
                }
                const result = await newMessage.save();
                console.log("messeage saved in database:", result);
                res.status(200).json({ newMessage: result });
                //todo socket IO thing
            }
            else {
                // let senderId = req.user._id
                // let receiverId = req.params.id;
                // let message_text = req.body.messageText;
                // let message_time = req.body.messageTime;
                // let image;
                // let recieverUser = await User.findById(receiverId);
                // let isrecieverUserAi = recieverUser.isAi;
                //testing
                let previousMessages = await Message.find({
                    $or: [
                        { senderId: senderId, receiverId: receiverId },
                        { senderId: receiverId, receiverId: senderId }
                    ],
                    isGroupChat: false
                }).sort({ createdAt: 1 });
                let promptWithHistory = "You are an AI chatting with a user. Here’s the conversation so far, also if message from user is deleted ignore that thing:\n";
                previousMessages.forEach(msg => {
                    promptWithHistory += `${msg.senderId.equals(senderId) ? "User" : "AI"}: ${msg.text}\n`;
                });
                promptWithHistory += `User: ${message_text}\nAI:`;
                console.log(promptWithHistory);

                //testing
                let prompt = req.body.messageText;
                const result = await gemini_ai.generateContent(promptWithHistory);
                console.log("SO he is talking with AI!");
                console.log(result.response.text());
                //user message save to database

                const newMessage1 = new Message({
                    senderId,
                    receiverId,
                    text: message_text,
                    image: image,
                    createdAt: message_time,
                    status: "delivered"
                });
                //response saved to database
                const newMessage2 = new Message({
                    senderId: receiverId,
                    receiverId: senderId,
                    text: result.response.text(),
                    createdAt: message_time,
                    status: "processed"
                });
                let s = await newMessage1.save();
                const savedMessage = await newMessage2.save();
                console.log("messeage saved in database:", savedMessage);
                res.status(200).json({ newMessage: savedMessage });
            }

        } catch (error) {
            console.log(error);
            res.status(500).send({ message: error.message })
        }
    });
message_router.put("/:id", isAuthenticated,
    async (req, res, next) => {
        try {
            let status = req.body.status;
            let senderId = req.user._id;
            let receiverId = req.params._id;
            await Message.updateMany({
                senderId: receiverId, // Only messages from the receiver
                receiverId: senderId, // Sent to the logged-in user
                status: { $ne: "seen" } // Only update unseen messages
            }, {
                $set: { status: status }
            });
            res.json({ message: "Seen status updated to databse also!" });

        } catch (error) {
            console.log(error);
            res.status(500).send({ message: error.message })
        }
    });
message_router.delete("/", isAuthenticated, async (req, res, next) => {
    try {
        const { isGroupChat, senderId, receiverId, createdAt } = req.body; // No need to parse JSON
        console.log("IN ROUTE", req.body);
        // Find and update the message
        let newMessage = await Message.updateMany(
            {
                isGroupChat,
                senderId,
                receiverId,
                createdAt,
            },
            {
                text: "This message was deleted",
                status: "delivered" // Ensure this is the correct status you want
            },
            { new: true } // Returns the updated document
        );
        let isrecieverUserAi = await User.findById(receiverId);
        isrecieverUserAi = isrecieverUserAi.isAi;
        if (isrecieverUserAi) {
            let newMessageAI = await Message.deleteMany(
                {
                    isGroupChat,
                    senderId: receiverId,
                    receiverId: senderId,
                    createdAt,
                }
            );
        }
        newMessage = await Message.find({
            isGroupChat,
            senderId,
            receiverId,
            createdAt,
        });
        // const { isGroupChat, senderId, receiverId, createdAt } = req.body; // No need to parse JSON

        await chatNotification.updateOne({
            senderId: senderId,
            recieverId: receiverId,
            createdAt: createdAt,
            isGroupChat: isGroupChat
        },
            {
                $set: { text: "This message was deleted" }
            });

        // If message not found
        if (!newMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json({ message: newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = message_router;