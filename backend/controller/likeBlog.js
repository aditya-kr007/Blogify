const Blog=require('../Schema/Blog')
const Notification=require('../Schema/Notification')

const likedBlog=(req,res)=>{
    const user_id=req.user
    const {_id,isLikedByUser}=req.body
    let incrementalVal=!isLikedByUser?1:-1
    Blog.findOneAndUpdate({_id},{$inc:{"activity.total_likes":incrementalVal}})
    .then(blog=>{
        if(!isLikedByUser){
            let like= new Notification({
                type:"like",
                blog:_id,
                notification_for:blog.author,
                user:user_id
            })
            like.save().then(notification=>{
                res.status(200).json({liked_by_user:true})
            })
        }
        else{
            Notification.findOneAndDelete({user:user_id,blog:_id,type:"like"})
            .then(data=>{
                res.status(200).json({liked_by_user:false})
            })
            .catch(err=>{
                return res.status(500).json({error:err.message})
            })
        }
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })
}

const isLikedByUser=async(req,res)=>{
    const user_id=req.user
    const id=req.body
    const id3=id["id3"]
    const id4=await Blog.findOne({blog_id:id3})
    const blog_id=id4._id

    
    Notification.find({user:user_id,type:"like",blog:blog_id})
    .then(result=>{
        return res.status(200).json({result})
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })
}
module.exports={likedBlog,isLikedByUser}