const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true

    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: {
            local_url: {
                type:String,

            },
            cloud_url:{
                type:String,
                default:`http://${process.env.hostname}:${process.env.PORT}/images/default_user.png`
            },
            public_id:{
                type:String
            } 
        }

    },

}, { timestamps: true });
userSchema.pre("save", async function (next) {
    try {
        this.password = await bcryptjs.hash(this.password, 10);
        next();
    }
    catch (err) {
        console.log(err);
        next(err);
    }
})

const user = mongoose.model("user", userSchema);
module.exports = user;