require("dotenv").config();
const express = require("express")
const path = require("path");
const cookieParser = require("cookie-parser");
const user_router = require("./routes/user.route")
const cors = require("cors");

const mongoose = require("mongoose");
const message_router = require("./routes/message.route");
const auth_router = require(`${path.join(__dirname, "/routes/auth.route")}`);
// const app = express();
const {http_server,app}=require("./socket");
mongoose.connect("mongodb://127.0.0.1:27017/chatApp").then(() => {
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
    origin: (origin, cb) => {
        cb(null, origin)
    },
    credentials: true
}))
app.use(express.static(`${path.join(__dirname, "/public")}`))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", auth_router);
app.use("/api/users", user_router)
app.use("/api/chats",message_router)
http_server.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}...`);

})