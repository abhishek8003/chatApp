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
        setTimeout(()=>{
            res.status(200).json({users:allUsers});
        },3000)
        
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })

    }
})
module.exports=user_router;