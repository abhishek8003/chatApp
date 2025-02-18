const multer = require("multer");
const path=require("path")
const fs=require("fs");
if(!fs.existsSync(path.join(__dirname,"profilePics"))){
fs.mkdirSync(path.join(__dirname,"profilePics"));
}
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now()
        cb(null, uniqueSuffix+"-"+file.originalname )
    },
    destination: (req, file, cb) => {
        cb(null,path.join(__dirname,"/profilePics"))
    }
});
const upload=multer({
    storage:storage
});
module.exports=upload;