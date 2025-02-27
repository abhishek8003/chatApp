const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
    isGroupChat:{
        type:Boolean,
        required:true,
        default:false
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    text: {
        type: String
    },
    image: {
        type: String
    }
},{timestamps:true});
const chatNotification=mongoose.model("chatNotification",notificationSchema);
module.exports=chatNotification;