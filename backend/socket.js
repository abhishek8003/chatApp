const {Server}=require("socket.io")
const express=require("express")
const http=require("http")
const app=express();
const http_server=http.createServer(app);
const io_server=new Server(http_server,{
    cors:["http://localhost:5173/"]
});
let online_users=[];
io_server.on("connection",(clientSocket)=>{
    console.log("A user joined with Socket id:",clientSocket.id);
    let user=clientSocket.handshake.query.user;
    online_users=[...online_users,user];
    io_server.emit("getOnlineUsers",[online_users]);

});
io_server.on("disconnect",(clientSocket)=>{
    console.log("A user disconnected with Socket id:",clientSocket.id);
})
module.exports={http_server,app};