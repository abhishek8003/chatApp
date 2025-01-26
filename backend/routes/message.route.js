const express = require("express")
const { validate_user, isAuthenticated } = require("../middlewares")
const Message = require('../models/messages');
const upload_message_images = require("../storage/localConfig/messageImages");
const cloudinary = require("../storage/cloudConfig/cloud");
const message_router = express.Router();
message_router.get("/:id", isAuthenticated, async (req, res, next) => {
    try {
        let senderId = req.user._id;
        let recieverId = req.params.id;
        let messages = await Message.find({
            $or: [{ senderId: senderId, receiverId: recieverId },
            { senderId: recieverId, receiverId: senderId }
            ]
        });
        setTimeout(()=>{
            res.status(200).send({ allMessages: messages });
        },4000);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message })

    }
});

message_router.post("/:id", upload_message_images.single("messageImage"), isAuthenticated, async (req, res, next) => {
    try {
        let senderId = req.user._id
        let receiverId = req.params.id;
        let message_text = req.body.messageText;
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
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text:message_text,
            image: image
        });
        const result = await newMessage.save();
        console.log(result);
        res.status(200).json({ newMessage: result });
        //todo socket IO thing

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message })
    }
});
module.exports = message_router;