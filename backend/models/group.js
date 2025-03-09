const mongoose = require("mongoose");
const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        default: "Group"
    },
    groupIcon: {
        type: {
            local_url: {
                type: String,
                default:""
            },
            cloud_url: {
                type: String,
                default: `${process.env.backendURL}/images/default_group_icon.png`
            },
            public_id: {
                type: String,
                default:""
            }
        },
        default: {
            local_url: '',
            cloud_url: `${process.env.backendURL}/images/default_group_icon.png`,
            public_id: '',
           
          },

    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    groupMembers: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            }
        ],
        default: []
    },
    pastMembers: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            }
        ],
        default: []
    },
    groupMessages: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "message"
            }
        ],
        default: []
    }

}, { timestamps: true });
const group = mongoose.model("group", groupSchema);
module.exports = group;