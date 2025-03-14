const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    isGroupChat: {
        type: Boolean,
        required: true,
        default: false
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    text: {
        type: String
    },
    image: {
        type: {
            local_url: {
                type: String,

            },
            cloud_url: {
                type: String,

            },
            public_id: {
                type: String
            }
        }
    },
    status: {
        type: String,
        enum: [ "delivered", "seen"],
        required:true,
        default: "sent"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const message = mongoose.model("message", messageSchema);
module.exports = message;