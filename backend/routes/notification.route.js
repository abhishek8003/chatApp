const express = require("express")
const mongoose = require("mongoose")
const { validate_user, isAuthenticated } = require("../middlewares")
const Message = require('../models/messages');
const upload_message_images = require("../storage/localConfig/messageImages");
const cloudinary = require("../storage/cloudConfig/cloud");
const { io_server } = require("../socket");
const notification_router = express.Router();
const ChatNotification = require("../models/chatNotification")
const GroupNotification = require("../models/groupNotification");
const User = require("../models/users");
const Group = require("../models/group");
notification_router.get("/:user_id", isAuthenticated, async (req, res, next) => {
    try {
        console.log("reequest for notiifactions!");
        let userId = req.params.user_id;
        let chatN = await ChatNotification.find({ recieverId: userId });
        let userGroups = await Group.find({
            $or: [
                { groupAdmin: userId },
                { groupMembers: { $elemMatch: { $eq: userId } } }
            ]
        });
        console.log(userGroups);
        let userGroupsIds = userGroups.map((e) => {
            return e._id;
        })
        console.log(userGroupsIds);
        let chatNG = await GroupNotification.find({ receiverId: { $in: userGroupsIds } });
        console.log(chatNG);

        let finalNotifcations = [...chatN, ...chatNG];
        console.log("finakl niotifjapsjf:", finalNotifcations);
        res.json({ all_notifications: finalNotifcations });
    } catch (error) {
        console.log(error);
        // res.status(500).send({ message: error.message })
    }
});


notification_router.delete("/", isAuthenticated,
    async (req, res, next) => {
        try {
            let notification = req.body;
            console.log("notification to be deleted: ", notification);
            if (notification.isGroupChat) {
                let result = await GroupNotification.deleteMany({
                    senderId: new mongoose.Types.ObjectId(notification.senderId),
                    receiverId: new mongoose.Types.ObjectId(notification.receiverId)
                });
                console.log(result);
            }
            else {
                let result = await ChatNotification.deleteMany({
                    senderId: new mongoose.Types.ObjectId(notification.senderId), 
                    recieverId: new mongoose.Types.ObjectId(notification.recieverId)
                });
                console.log(result);
            }
            res.status(200).json({ message: "Notifications deleted successfully" });

        } catch (error) {
            console.log(error);
            res.status(500).send({ message: error.message })
        }
    });
module.exports = notification_router;