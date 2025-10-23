const {ytid}=require('ytid')
const User = require('../Schema/User')

const generateUsername = async (email) => {
    let username = email.split("@")[0]
    const userNameExist = await User.exists({ "personal_info.username": username }).then((result) => result)
    userNameExist ? username += ytid() : ""
    return username
}

module.exports={generateUsername}