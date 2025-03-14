const express = require("express")
const { validate_user, isAuthenticated } = require("../middlewares")
const Message = require('../models/messages');
const Group = require("../models/group");
const upload_message_images = require("../storage/localConfig/messageImages");
const cloudinary = require("../storage/cloudConfig/cloud");
const { io_server } = require("../socket");
const group_route = express.Router();
const User = require("../models/users");
const fs = require("fs");
const mongoose = require("mongoose");
const groupNotification = require("../models/groupNotification");
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
        // setTimeout(()=>{
        //     res.status(200).send({ group: completeGroup });
        // },5000)
        res.status(200).send({ group: completeGroup });
        

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message })

    }
});


group_route.post("/group/:group_id/message", upload_message_images.single("messageImage"), isAuthenticated, async (req, res, next) => {
    try {
        let groupId = req.params.group_id;
        let senderId = req.user._id;
        let message_text = req.body.messageText;
        let image;
        // Check if group exists
        let groupExists = await Group.findById(groupId);
        if (!groupExists ) {
            return res.status(404).json({ message: "Group not found" });
        }
        console.log(groupExists.pastMembers);
        console.log(senderId);
        
        if(groupExists.pastMembers.includes(senderId)){
            console.log("yup");
            return res.status(401).json({ message: "You are not a member of this grup anymore!" });
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
            // image = {
            //     local_url: req.file.path,
            //     cloud_url: req.file.path,
            //     public_id: ""
            // }
        }

        const newMessage = new Message({
            isGroupChat: true,
            senderId: senderId,
            receiverId: groupId,
            text: message_text,
            image: image
        });

        let notificationImage = image ? image.cloud_url : "";
        let savedMessage = await newMessage.save();
        console.log(savedMessage);

        let updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            { $push: { groupMessages: savedMessage._id } },
            { new: true }
        ).populate(["groupAdmin", "groupMembers", { path: "groupMessages", populate: "senderId" }]);
        let notification = new groupNotification({
            isGroupChat: true,
            senderId: senderId,
            receiverId: updatedGroup._id,
            text: message_text,
            image: notificationImage
        });
        try {
            let response = await notification.save();
        }
        catch (err) {
            console.log(err);

        }
        res.json({ group: updatedGroup, message: "Group message saved!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
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
            res.status(200).json({ newGroup: result, message: "Group created successfully!" });


        } catch (error) {
            console.log(error);
            res.status(500).send({ message: error.message })
        }
    });
// group_route.put("/:group_id/addMembers", isAuthenticated, async (req, res) => {
//     try {
//         let groupId = req.params.group_id;
//         let newMembers=req.body;
//         console.log("members to be added",newMembers);
//         console.log("group to be modified",groupId);
//         let newUpdatedGroup=await Group.findByIdAndUpdate(groupId,{
//             $addToSet:{
//                 //add groupId._id if not present  in groupMembers
//                 "groupMembers":newMembers._id
//             },
//             $pull:{
//                 "pastMembers":newMembers._id
//             }
//         })
        
//         //todo

//     } catch (error) {

//     }
// });
group_route.put("/:group_id/addMembers", isAuthenticated, async (req, res) => {
    try {
        const { group_id } = req.params;
        const newMembers = req.body;

        if (!newMembers || newMembers.length === 0) {
            return res.status(400).json({ message: "No members provided" });
        }

        let newMembersId = newMembers.map((e) => e._id);

        console.log("Group ID:", group_id);
        console.log("New Members ID:", newMembersId);

        // Remove members from pastMembers
        await Group.findByIdAndUpdate(
            group_id,
            { $pull: { pastMembers:  { $in: newMembersId }} }, // Correct `$pull`
            { new: true }
        );

        // Add members to groupMembers in a single operation
        let finalGroup = await Group.findByIdAndUpdate(
            group_id,
            { $addToSet: { groupMembers: { $each: newMembersId } } }, // Efficient batch update
            { new: true }
        );

        if (!finalGroup) {
            return res.status(404).json({ message: "Group not found" });
        }

        console.log("Updated Group with Added Members:", finalGroup);
        res.json({ message: "Members added successfully", group: finalGroup });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

group_route.delete("/:group_id/deleteMember/:member_id", isAuthenticated, async (req, res) => {
    try {
        let groupId = req.params.group_id;
        let memberId = req.params.member_id;

        console.log("Deleting member from group:", groupId, "Member ID:", memberId.toString());
        let isUserOwner = false;
        let targetGroup = await Group.findById(groupId);
        if (targetGroup.groupAdmin.toString() === req.user._id.toString()) {
            isUserOwner = true;
        }
        if (isUserOwner) {


            // Find the group by ID and pull the member from the groupMembers array
            let updatedGroup = await Group.findByIdAndUpdate(
                
                groupId,
                {
                    
                    $addToSet: {
                        pastMembers: memberId // push the memberId from the groupMembers array
                    },
                   
                },
                { new: true } // Returns the updated group after the update
            );
            
            if (!updatedGroup) {
                return res.status(404).json({ message: 'Group not found' });
            }

            // Respond with the updated group
            return res.status(200).json({ message: "Memeber kicked sucessfully!", group: updatedGroup });
        }
        return res.status(401).json({ message: "You are not an admin!", group: updatedGroup });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while deleting the member' });
    }
});
group_route.put("/:group_id/addMember/:member_id", isAuthenticated, async (req, res) => {
    try {
        let groupId = req.params.group_id;
        let memberId = req.params.member_id;

        console.log("Deleting member from group:", groupId, "Member ID:", memberId);
        let isUserOwner = false;
        let targetGroup = await Group.findById(groupId);
        if (targetGroup.groupAdmin.toString() === req.user._id.toString()) {
            isUserOwner = true;
        }
        if (isUserOwner) {


            // Find the group by ID and pull the member from the groupMembers array
            let updatedGroup = await Group.findByIdAndUpdate(
                
                groupId,
                {
                    
                    $push: {
                        pastMembers: memberId // push the memberId from the groupMembers array
                    },
                   
                },
                { new: true } // Returns the updated group after the update
            );
            
            if (!updatedGroup) {
                return res.status(404).json({ message: 'Group not found' });
            }

            // Respond with the updated group
            return res.status(200).json({ message: "Memeber kicked sucessfully!", group: updatedGroup });
        }
        return res.status(401).json({ message: "You are not an admin!", group: updatedGroup });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while deleting the member' });
    }
});


module.exports = group_route;