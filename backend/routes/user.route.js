const express = require("express")
const { validate_user, isAuthenticated } = require("../middlewares");
const User = require("../models/users");
const { io_server } = require("../socket");
const user_router = express.Router();
user_router.get("/", isAuthenticated, async (req, res, next) => {
    try {

        // console.log(req.user);
        let allUsers = await User.find({
            _id: { $ne: req.user._id }
        });
        // console.log(allUsers);
        setTimeout(() => {
            res.status(200).json({ users: allUsers });
        }, 1000)

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })

    }
});
user_router.get("/:user_id/friends", async (req, res, next) => {
    try {
        let userId = req.params.user_id;
        let targetUser = await User.findById(userId).populate("friends");
        res.json(targetUser);
    } catch (error) {
        console.log(error);
    }
});
user_router.post("/:user_id/addFriends", async (req, res) => {
    try {
        console.log("Add friend request received!");
        let userId = req.params.user_id;
        let newFriends = req.body; // Expecting an array of friend IDs
        // Validate the request
        if (!Array.isArray(newFriends) || newFriends.length === 0) {
            return res.status(400).json({ message: "Invalid friends data" });
        }
        let friendIds = newFriends.map(friend => friend._id);
        console.log("Friend IDs:", friendIds);

        let currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Add new friends to the user's friends list
        friendIds.forEach(async(element)=>{
            await User.findByIdAndUpdate(userId,{
                $addToSet:{friends:element}
            })
        });
        await User.updateMany(
            { _id: { $in: friendIds } },
            { $addToSet: { friends: userId } }
        );
        res.status(200).json({ message: "Friends added successfully!" });

    } catch (error) {
        console.error("Error adding friends:", error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = user_router;