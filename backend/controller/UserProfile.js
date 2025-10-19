const Blog =require('../Schema/Blog')
const User = require('../Schema/User')

const UserProfileSearch=(req,res)=>{
    const {username}=req.body
     User.findOne({"personal_info.username":username})
    .select("-personal_info.password -google_auth -updatedAt -blogs")
    .then(user=>{
        return res.status(200).json(user)
    })
    .catch(err=>{
        console.log(err)
        return res.status(404).json({error:err.message})
    })
}

module.exports={UserProfileSearch}