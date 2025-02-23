const mongoose = require("mongoose");
const { ObjectId } = require('mongodb')
mongoose.connect("mongodb://127.0.0.1:27017/chatApp").then(() => {
    console.log("connected to mongoDB");
}).catch((err) => {
    console.log(err);
});
const Users = require("./models/users");
const Message = require("./models/messages");
const bcrypt = require('bcryptjs');
async function insertUsers(db) {
    const users = [];
    const passwordHash = await bcrypt.hash("123456", 10); // Hash the password once
  
    for (let i = 1; i <= 100; i++) {
      users.push({
        _id: new ObjectId(),
        username: `testingoi${i}`,
        email: `user${i}@example.com`,
        fullName: `testing ${i}`,
        password: passwordHash,
        profilePic: {
          local_url: '',
          cloud_url: '"https://chatapp-q0p1.onrender.com/images/default_user.png"',
          public_id: '',
          _id: new ObjectId()
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      });
    }
  
    await Users.insertMany(users);
    console.log('100 users inserted successfully');
  }
// insertUsers();
(async()=>{
    try{
        await Users.deleteMany({});
        await Message.deleteMany({});
        console.log("Database wiped");


    }
    catch(err){
        console.log(err);
        
    }
})();
