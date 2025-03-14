const express = require("express")
const { validate_user, isAuthenticated } = require("../middlewares")
const Message = require('../models/messages');
const upload_message_images = require("../storage/localConfig/messageImages");
const cloudinary = require("../storage/cloudConfig/cloud");
const { io_server } = require("../socket");
const chatNotification = require("../models/chatNotification");
const message_router = express.Router();
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
            let message_time=req.body.messageTime;
            let image;
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
            console.log("MESSAGE IN DATA TIME:",message_time);
            const newMessage = new Message({
                senderId,
                receiverId,
                text: message_text,
                image: image,
                createdAt:message_time,
                status:"delivered"
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
            console.log("messeage saved in database:",result);
            res.status(200).json({ newMessage: result });
            //todo socket IO thing

        } catch (error) {
            console.log(error);
            res.status(500).send({ message: error.message })
        }
    });
message_router.put("/:id", isAuthenticated,
    async (req, res, next) => {
        try {
            let status=req.body.status;
            let senderId=req.user._id;
            let receiverId=req.params._id;
            await Message.updateMany({
                senderId: receiverId, // Only messages from the receiver
                receiverId: senderId, // Sent to the logged-in user
                status: { $ne: "seen" } // Only update unseen messages
            }, {
                $set: { status: status }
            });
            res.json({message:"Seen status updated to databse also!"});

        } catch (error) {
            console.log(error);
            res.status(500).send({ message: error.message })
        }
    });
module.exports = message_router;