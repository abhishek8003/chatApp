const joi=require("joi");
const userSchema=joi.object({
    email:joi.string().min(3).required(),
    fullName:joi.string().required(),
    password:joi.string().required().min(3),
    profilePic:joi.allow()
});
module.exports=userSchema;