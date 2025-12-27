const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET_KEY;

function createToken(user){
return jwt.sign({userId:user._id},SECRET,{ expiresIn:"7d"});
}

function verifyToken(token){
    try{
        return jwt.verify(token, SECRET);
    }catch(error){
        return null;
    }
}
module.exports = {createToken,verifyToken};