const multer = require("multer");
const path=require("path")
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now()
        cb(null, uniqueSuffix+"-"+file.originalname )
    },
    destination: (req, file, cb) => {
        cb(null,path.join(__dirname,"messageImages"))
    }
});
const upload=multer({
    storage:storage
});
module.exports=upload;