const User =require('../Schema/User')


const updateProfileImage=(req,res)=>{
    const user_id=req.user
    const {url}=req.body
    User.findOneAndUpdate({_id:user_id},{"personal_info.profile_img":url})
    .then(()=>{
        return res.status(200).json({profile_img:url})
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })
}

module.exports={updateProfileImage}