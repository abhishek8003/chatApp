const express = require("express");
const User = require("../models/users");
const auth_router = express.Router();
const fs = require("fs")
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const userSchema = require("../schema/userSchema");
const upload_profile_pics = require("../storage/localConfig/profilePicslocal");
const My_SECRET = "mysecret1";
const cloudinary = require("../storage/cloudConfig/cloud");
const { validate_user, isAuthenticated } = require("../middlewares");
const { io_server } = require("../socket");
const path = require("path");
//create a AI user
let initAI=async () => {
    try {
        let anyAi = await User.find({ isAi: true });
        console.log(anyAi);
        if (anyAi.length) {
            console.log("Ai user exists!");
        }
        else {
            let ai_user = new User({
                isAi: true,
                email: "chatgpt@ai.com",
                fullName: "Your Assistant",
                friends: [],
                password: 123456,
                profilePic: {
                    local_url:`${process.env.backendURL}/images/ai_image.png`,
                    cloud_url:`${process.env.backendURL}/images/ai_image.png`,
                    public_id: ""
                }
            });
            await ai_user.save();
            console.log("AI intialized!");

        }
    } catch (error) {
        console.log(error);
    }
}
//create normal user
auth_router.post("/login", validate_user,initAI, async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const registeredUser = await User.findOne({ email: email });

        if (!registeredUser) {
            return res.status(400).json({ message: "Invalid email " });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, registeredUser.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid  password" });
        }

        const newAccessToken = jwt.sign(
            { _id: registeredUser._id, fullName: registeredUser.fullName },
            My_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("access_token", newAccessToken, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            sameSite: process.env.NODE_ENV == "production" ? "None" : "strict",

        });

        res.status(200).json({ message: "Login successful", user: registeredUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

auth_router.post("/register", upload_profile_pics.single("profilePic"), validate_user,initAI, async (req, res, next) => {
    try {
        let { fullName, email } = req.body;
        let exists = await User.findOne({ email: email });
        let profilePic;
        console.log(req.file);
        if (req.file) {
            console.log("REQUEST FLE CAME");

            let result = await cloudinary.uploader.upload(req.file.path, {
                folder: "chatApp/profilePics",
                public_id: `${req.file.originalname}`
            })
            console.log(result);
            profilePic = {
                local_url: req.file.path,
                cloud_url: result.url,
                public_id: result.public_id
            }
        }
        else {
            profilePic = {
                local_url: "",
                cloud_url: `${process.env.backendURL}/images/default_user.png`,
                public_id: ""
            };
        }
        if (!exists) {
            let ai_user = await User.findOne({ isAi: true });
            console.log("YOUR AI friend", ai_user);
            //make user AIs friend
            let newUser = new User({
                ...req.body,
                profilePic: profilePic,
                friends: [ai_user._id] // Store AI user's ID
            });
            let registeredUser = await newUser.save();
            //
            await User.updateOne(
                { isAi: true },
                { $push: { friends: registeredUser._id } } 
            );

            //make Ais as user friend

            console.log("newUserRegistered:", registeredUser);
            io_server.emit("newUserRegistered", registeredUser);
            let newAccessToken = jwt.sign({ _id: registeredUser._id, fullName: registeredUser.fullName }, My_SECRET, {
                expiresIn: "1h"
            })
            res.cookie("access_token", newAccessToken, {
                maxAge: (1000 * 60 * 60),
                secure: process.env.NODE_ENV == "production",
                sameSite: process.env.NODE_ENV == "production" ? "None" : "strict",
            })
            res.status(200).json({ message: "user registered", user: registeredUser });

        }
        else {
            res.status(400).json({ message: "user already exists kinldy login" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }

})
auth_router.get("/logout", (req, res, next) => {
    try {
        res.clearCookie("access_token");
        res.status(200).json({ message: "You are logged out!" });
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }

});

auth_router.put("/update-profile", isAuthenticated, upload_profile_pics.single("profilePic"), async (req, res, next) => {
    try {
        console.log(req.file);
        let user = req.user;
        let profilePic;
        if (req.file) {
            console.log("REQUEST FLE CAME");

            let result = await cloudinary.uploader.upload(req.file.path, {
                folder: "chatApp/profilePics",
                public_id: `${req.file.originalname}`
            })
            console.log(result);
            profilePic = {
                local_url: req.file.path,
                cloud_url: result.url,
                public_id: result.public_id
            }
        }
        else {
            profilePic = {
                local_url: "",
                cloud_url: `${process.env.backendURL}/images/default_user.png`,
                public_id: ""
            };
        }
        let oldUser = await User.findById(req.user._id);
        console.log(`old: ${oldUser}`);

        //cloud remove
        let public_id = oldUser.profilePic.public_id;
        if (public_id) {
            let result = await cloudinary.uploader.destroy(public_id);
            console.log(`Remove cloud result: ${result}`);

            console.log("Removed cloud");
        }
        //local remove
        let local_url = oldUser.profilePic.local_url;
        if (local_url) {

            fs.unlink(oldUser.profilePic.local_url, (err) => {
                if (err) {
                    console.log('Error deleting file:', err);
                } else {
                    console.log('File deleted locally successfully');
                }
            });
        }
        let newUser = await User.findOneAndUpdate({ _id: req.user.id }, {
            profilePic: profilePic
        }, { new: true })
        console.log(`newUser: ${newUser}`);
        io_server.emit("profileUpdated", newUser);
        res.status(200).json({ message: "Profile image updated!", user: newUser })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
})
auth_router.get("/check", isAuthenticated, (req, res, next) => {
    try {
        // setTimeout(()=>{
        // console.log("hi");
        // // console.log(req.user);

        // },5000)
        res.status(200).json({ message: "welcome", user: req.user })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
})

module.exports = auth_router;