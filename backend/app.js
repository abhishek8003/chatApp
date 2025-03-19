require("dotenv").config();
const express = require("express")
const path = require("path");
const cookieParser = require("cookie-parser");
const user_router = require("./routes/user.route")
const cors = require("cors");
let Users=require("./models/users");

const mongoose = require("mongoose");
const message_router = require("./routes/message.route");
const auth_router = require(`${path.join(__dirname, "/routes/auth.route")}`);
// const app = express();
const {http_server,app}=require("./socket");
const group_route = require("./routes/group.route");
const notification_router = require("./routes/notification.route");
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("connected to mongoDB");
}).catch((err) => {
    console.log(err);
})
// app.use(
//     cors({
//       origin: "http://localhost:5173", 
//       credentials: true, 
//     })
//   );
app.use(cors({
    origin: process.env.frontendURL,
    credentials: true
}))
app.use(express.static(`${path.join(__dirname, "/public")}`))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", auth_router);
app.use("/api/users", user_router)
app.use("/api/chats",message_router);
app.use("/api/groups",group_route)
app.use("/api/notifications",notification_router);
app.get("*",(req,res,next)=>{
    res.redirect(process.env.frontendURL);
});
http_server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on ${process.env.PORT || 5000}...`);

});