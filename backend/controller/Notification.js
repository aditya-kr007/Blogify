const Notification=require('../Schema/Notification')

const getNotification=(req,res)=>{
    const user_id=req.user
    Notification.exists({notification_for:user_id,seen:false,user:{$ne:user_id}})
    .then(result=>{
        if(result){
            return res.status(200).json({new_notification:true})
        }
        else{
            return res.status(200).json({new_notification:false})
        }
    })
    .catch(err=>{
        console.log(err)
        return res.status(500).json({error:err.message})
    })
}

const getNotificationData=(req,res)=>{
    const user_id=req.user
    const {page,filter,deletedDocsCount}=req.body
    const maxLimit=10
    let findQuery={
        notification_for:user_id,
        user:{$ne:user_id},

    }
    let skipDocs=(page-1)*maxLimit
    if(filter!="all"){
        findQuery.type=filter
    }
    if(deletedDocsCount){
        skipDocs-=deletedDocsCount
    }
    Notification.find(findQuery)
    .skip(skipDocs)
    .limit(maxLimit)
    .populate("blog","title blog_id")
    .populate("user","personal_info.name personal_info.profile_img personal_info.username")
    .populate("comment","comment")
    .populate("replied_on_comment","comment")
    .populate("reply","comment")
    .sort({createdAt:-1})
    .select("createdAt type seen reply")
    .then(notifications=>{
        Notification.updateMany(findQuery,{seen:true})
        .skip(skipDocs)
        .limit(maxLimit)
        .then(()=>console.log("notification seen"))
        return res.status(200).json({notifications})
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })
}

const allNotificationCount=(req,res)=>{
    const user_id=req.user
    const {filter}=req.body
    let finQuery={
        notification_for:user_id,
        user:{$ne:user_id},
    }
    if(filter!="all"){
        finQuery.type=filter
    }
    Notification.countDocuments(finQuery)
    .then(count=>{
        return res.status(200).json({totalDocs:count})
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })
}

module.exports={getNotification,getNotificationData,allNotificationCount}