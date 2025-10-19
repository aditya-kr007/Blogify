const User =require('../Schema/User')


const updateProfile=(req,res)=>{
    const user_id=req.user
    const {username,bio,social_links}=req.body
    console.log(username)
    if(username.length<3){
        return res.status(403).json({error:"Username should be at least 3 characters long"})
    }
    if(bio.length>200){
        return res.status(403).json({error:"Bio should be less than 200 characters"})
    }

    const socialLinksArr=Object.keys(social_links)
    try {
        for(let i=0;i<socialLinksArr.length;i++){
            if(social_links[socialLinksArr[i]].length){
                let hostname=new URL(social_links[socialLinksArr[i]]).hostname
                if(!hostname.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i]!='twitter'){
                    return res.status(403).json({error:`${socialLinksArr[i]} link is invalid`})
                }
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Please provide a valid https social link"})
    }

    let updateObj={
        "personal_info.username":username,
        "personal_info.bio":bio,
        social_links
    }

    User.findOneAndUpdate({_id:user_id},updateObj,{
        runValidators:true
    })
    .then(()=>{
        return res.status(200).json({username})
    })
    .catch(err=>{
        if(err.code===11000){
            return res.status(409).json({error:"Username is already taken"})
        }
        return res.status(500).json({error:err.message})
    })
}

module.exports={updateProfile}