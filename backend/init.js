const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/chatApp").then(() => {
    console.log("connected to mongoDB");
}).catch((err) => {
    console.log(err);
});
const User = require("./models/users");
const Message = require("./models/messages");
(async()=>{
    try{
        await User.deleteMany({});
        await Message.deleteMany({});
        console.log("Database wiped");
    }
    catch(err){
        console.log(err);
        
    }
})();