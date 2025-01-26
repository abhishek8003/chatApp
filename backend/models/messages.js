const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    text: {
        type: String
    },
    image: {
        type: {
            local_url: {
                type:String,

            },
            cloud_url:{
                type:String,
                
            },
            public_id:{
                type:String
            } 
        }
    }
},{timestamps:true});
const message=mongoose.model("message",messageSchema);
module.exports=message;