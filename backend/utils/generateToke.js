const jwt=require("jsonwebtoken")
const GenerateAccessToken=(user)=>{
    const Token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY)
    return Token;
}

module.exports={GenerateAccessToken}