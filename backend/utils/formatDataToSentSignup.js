const { GenerateAccessToken } = require("./generateToke")

const formatDataToSent=(user)=>{
    const token=GenerateAccessToken(user)
    return {
        token,
        profile_img:user.personal_info.profile_img,
        username:user.personal_info.username,
        name:user.personal_info.name
    }
}

module.exports={formatDataToSent}