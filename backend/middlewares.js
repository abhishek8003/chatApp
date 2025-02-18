const User = require("./models/users");

const jwt = require("jsonwebtoken");
const My_SECRET = "mysecret1";
const userSchema = require("./schema/userSchema");

const validate_user = (req, res, next) => {
    console.log(req.body);
    
    let result = userSchema.validate(req.body, { abortEarly: false });
    if (result.error) {
        console.log(result.error.details);
        let error_message = result.error.details.map((e) => {
            return e.message
        }).join(",");
        console.log(error_message);
        res.status(400).json({ message: error_message })
    }
    else {
        next();
    }
}
const isAuthenticated = async (req, res, next) => {
    try {
        let access_token = req.cookies.access_token;
        if (access_token) {
            jwt.verify(access_token, My_SECRET, async (err, data) => {
                if (err) {
                    console.log("token invalid or expired kindly login again!");
                    
                    res.status(401).json({ message: "token invalid or expired kindly login again!" });
                }
                else {
                    let user = await User.findById(data._id);
                    if (user) {
                        req.user = user
                        next();
                    }
                    else {
                        console.log("user doesnt exists anymore");
                        
                        res.status(404).json({ message: "user doesnt exists anymore" });
                    }
                }
            });

        }
        else {
            res.status(401).json({ message: "You are not authenticated" });
        }
    }
    catch (err) {
        console.log(err);

    }
}
module.exports = { isAuthenticated, validate_user };