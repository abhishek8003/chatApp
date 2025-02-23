const express = require("express")
const { validate_user, isAuthenticated } = require("../middlewares")
const Message = require('../models/messages');
const Group = require("../models/group");
const upload_message_images = require("../storage/localConfig/messageImages");
const cloudinary = require("../storage/cloudConfig/cloud");
const { io_server } = require("../socket");
const group_route = express.Router();
const User = require("../models/users");
const upload_group_logo = require("../storage/localConfig/groupImages");
group_route.get("/:user_id", isAuthenticated, async (req, res, next) => {

    try {
        let userId = req.params.user_id;
        let groups = await Group.find({
            $or: [
                { groupAdmin: userId },
                { groupMembers: { $elemMatch: { $eq: userId } } }
            ]
        });

        res.status(200).send({ allGroups: groups });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message })

    }
});
group_route.get("/group/:group_id", isAuthenticated, async (req, res, next) => {

    try {
        let groupId = req.params.group_id;
        let completeGroup = await Group.findById(groupId).populate(["groupAdmin", "groupMembers", { path: "groupMessages", populate: "senderId" }]);

        res.status(200).send({ group: completeGroup });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message })

    }
});
const fs = require("fs");
const mongoose = require("mongoose");

group_route.post("/group/:group_id/message", upload_message_images.single("messageImage"), isAuthenticated, async (req, res, next) => {
    try {
        let groupId = req.params.group_id;
        let senderId = req.user._id;
        let message_text = req.body.messageText ;
        let image;
        // Check if group exists
        let groupExists = await Group.findById(groupId);
        if (!groupExists) {
            return res.status(404).json({ message: "Group not found" });
        }
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
            };
        }

        const newMessage = new Message({
            isGroupChat: true,
            senderId: senderId,
            receiverId: groupId,
            text: message_text,
            image: image
        });

        let savedMessage = await newMessage.save();
        console.log(savedMessage);

        let updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            { $push: { groupMessages: savedMessage._id } },
            { new: true }
        ).populate(["groupAdmin", "groupMembers", { path: "groupMessages", populate: "senderId" }]);

        res.json({ group: updatedGroup, message: "Group message saved!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


// formData.append("groupName", groupName);
//         formData.append("members", JSON.stringify(selectedFriends));
//         if (groupImg.current.files.length > 0) {
//           formData.append("groupImage", groupImg.current.files[0]);
//         }
group_route.post("/:admin_id", upload_group_logo.single("groupImage"), isAuthenticated,
    async (req, res, next) => {
        try {
            let adminId = req.params.admin_id;
            let groupInfo = req.body;
            console.log(groupInfo.adminId);
            console.log(groupInfo.groupName);
            console.log(groupInfo.members);
            let membersId = JSON.parse(groupInfo.members)
            let adminUser = await User.findById(adminId);
            let members = await User.find({ _id: { $in: membersId } });
            console.log(members);
            let image;
            if (req.file) {
                console.log(req.file);
                let responseFromCloud = await cloudinary.uploader.upload(req.file.path, {
                    folder: "chatApp/groupIcons"
                });
                console.log(responseFromCloud);
                image = {
                    local_url: req.file.path,
                    cloud_url: responseFromCloud.url,
                    public_id: responseFromCloud.public_id
                }
            }

            const newGroup = new Group({
                groupName: groupInfo.groupName,
                groupIcon: image,
                groupAdmin: adminUser,
                groupMembers: members,
                groupMessages: []
            })
            console.log(newGroup);

            const result = await newGroup.save();
            console.log(result);
            res.status(200).json({ newGroup: result,message:"Group created successfully!" });
            //todo socket IO thing

        } catch (error) {
            console.log(error);
            res.status(500).send({ message: error.message })
        }
    });
module.exports = group_route;