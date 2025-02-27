const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
    isGroupChat:{
        type:Boolean,
        required:true,
        default:true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"group",
        required:true
    },
    text: {
        type: String
    },
    image: {
        type: String
    }
},{timestamps:true});
const groupNotification=mongoose.model("groupNotification",notificationSchema);
module.exports=groupNotification;