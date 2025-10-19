const {ytid}=require('ytid')
const Blog =require('../Schema/Blog')
const User = require('../Schema/User')
const Notification=require('../Schema/Notification')
const Comment=require('../Schema/Comment')


const searchUser=(req,res)=>{
    let {query}=req.body
    User.find({"personal_info.username":new RegExp(query,'i')})
    .limit(50)
    .select("personal_info.name personal_info.username personal_info.profile_img -_id")
    .then(users=>{
        return res.status(200).json({users})
    })
    .catch(err=>{
        console.log(err)
        return res.status(500).json({error:err.message})
    })
}

const CreateBlog=async(req,res)=>{
    const authorId=req.user
    let {title,banner,content,tags,des,draft,id}=req.body

    if(!title.length) return res.status(403).json({error:"You must provide a title to publish/Draft the blog"})

    if(!draft){
            if(!des.length || des.length>200){
                return res.status(403).json({error:"You must provide a description under 200 characters"})
            }
            if(!banner.length){
                return res.status(403).json({error:"You must provide a banner image to publish it"})
            }
            if(!content.blocks.length){
                return res.status(403).json({error:"There must be some blog content to publish it"})
            }
            if(!tags.length || tags.length>10){
                return res.status(403).json({error:"You must provide at least 1 tag to publish the blog"})
            }
        
    }
    
    tags=tags.map(tag =>{ return tag.toLowerCase() }
    );
    let blog_id=id || title.replace(/[^a-zA-z0-9]/g,'').replace(/\s+/g,"-").trim()+ytid()
    if(id){
        Blog.findOneAndUpdate({blog_id:id},{
            title,
            banner,
            content,
            tags,
            des,
            draft:draft?draft:false
        })
        .then(()=>{
            return res.status(200).json({id:blog_id})
        })
        .catch(err=>{
            return res.status(500).json({error:"Failed to update"})
        })
    }
    else{
        const blog= new Blog({
            author:authorId,
            blog_id,
            title,
            banner,
            content,
            tags,
            des,
            draft:Boolean(draft)
        })
        console.log(blog._id)
        blog.save().then(blog=>{
            let incVal=draft?0:1
            User.findOneAndUpdate({_id:authorId},{$inc:{"account_info.total_posts":incVal},$push:{"blogs":blog._id}})
            .then(user=>{
                return res.status(200).json({id:blog.blog_id})
            })
            .catch(err=>{return res.status(500).json({error:"Failed to update total post number"})})
        })
        .catch(err=>{return res.status(500).json({error:err.message})})
    }


}

const DeleteBlog=(req,res)=>{
    const user_id=req.user
    const {blog_id}=req.body
    Blog.findOneAndDelete({blog_id})
    .then(blog=>{
        Notification.deleteMany({blog:blog._id})
        .then(data=>console.log("notification deleted"))
        Comment.deleteMany({blog_id:blog._id})
        .then(data=>console.log("comments deleted"))
        User.findOneAndUpdate({_id:user_id},{$pull:{"blogs":blog._id},$inc:{"account_info.total_posts":-1}})
        .then(user=>console.log("Blog deleted"))
        return res.status(200).json({status:"done"})
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })
}

const getLatestBlog=async(req,res)=>{
    const {page}=req.body
    Blog.find({draft:false}).populate("author","personal_info.profile_img personal_info.name personal_info.username -_id")
    .sort({"publishedAt":-1})
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page-1)*5)
    .limit(5)
    .then(blogs=>{
        return res.status(200).json({blogs})
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })
}

const getTrendingBlog=async(req,res)=>{
    Blog.find({draft:false}).populate("author","personal_info.profile_img personal_info.name personal_info.username -_id")
    .sort({"activity.total_read":-1, "activity.total_likes":-1,"publishedAt":-1})
    .select("blog_id title publishedAt banner -_id")
    .limit(5)
    .then(blogs=>{
        return res.status(200).json({blogs})
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })


}

const getFilteredBlogs=(req,res)=>{
    let {tag, query, page,author,limit, eliminate_blog}=req.body
    let findQuery
    if(tag){
        findQuery={tags:tag,draft:false,blog_id:{$ne:eliminate_blog}}
    }
    else if(query){
        findQuery={ draft:false, title: new RegExp(query,'i') }
    }
    else if(author){
        findQuery={draft:false,author}
    }

    let maxLimit=limit?limit:3
    Blog.find(findQuery).populate("author","personal_info.profile_img personal_info.name personal_info.username -_id")
    .sort({"activity.total_read":-1, "activity.total_likes":-1,"publishedAt":-1})
    .select("blog_id title publishedAt banner activity tags des -_id")
    .skip((page-1)*5)
    .limit(maxLimit)
    .then(blogs=>{
        return res.status(200).json({blogs})
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })


}

const allLatestBlogCount=async(req,res)=>{
    Blog.countDocuments({draft:false})
    .then(count=>{
        return res.status(200).json({totalDocs:count})
    })
    .catch(err=>{
        console.log(err)
        return res.status(500).json({error:err.message})
    })
}

const searchBlogCount=async(req,res)=>{
    let {tag,query,author}=req.body
    let findQuery
    if(tag){
        findQuery={tags:tag,draft:false}
    }
    else if(query){
        findQuery={ draft:false, title: new RegExp(query,'i') }
    }
    else if(author){
        findQuery={draft:false,author}
    }
    
    Blog.countDocuments(findQuery)
    .then(count=>{
        return res.status(200).json({totalDocs:count})
    })
    .catch(err=>{
        console.log(err)
        return res.status(500).json({error:err.message})
    })
}

const getSpecificBlog=async(req,res)=>{
    const {blog_id,draft,mode}=req.body
    let incrementalValue=mode!="edit"?1:0
    Blog.findOneAndUpdate({blog_id},{$inc:{"activity.total_reads":incrementalValue}})
    .populate("author","personal_info.name personal_info.username personal_info.profile_img")
    .select("title des content activity banner publishedAt blog_id tags")
    .then(blog=>{
        User.findOneAndUpdate({"personal_info.username":blog?.author.personal_info.username},{
            $inc:{"account_info.total_reads":incrementalValue}
        })
        .catch(err=>{
            return res.status(500).json({error:err.message})
        })
        if(blog.draft && !draft){
            return res.status(500).json({error:"You can not access draft blogs"})
        }
        return res.status(200).json({blog})
    })
    
    .catch(err=>{
        console.log(err)
        return res.status(500).json({error:err.message})
    })

}

const userWrittenBlogs=(req,res)=>{
    const user_id=req.user
    
    const {page,draft,query,deletedDocsCount}=req.body
    let maxLimit=5
    let skipDocs=(page-1)*maxLimit
    
    if(deletedDocsCount){
        skip-=deletedDocsCount
    }
    Blog.find({author:user_id,draft,title:new RegExp(query,'i')})
    .skip(skipDocs)
    .limit(maxLimit)
    .sort({publishedAt:-1})
    .select("title banner publishedAt blog_id activity des draft -_id")
    .then(blogs=>{
        return res.status(200).json({blogs})
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })

}

const userWrittenBlogsCount=(req,res)=>{
    const user_id=req.user
    const {draft,query}=req.body
    Blog.countDocuments({author:user_id, draft, title:new RegExp(query,"i")})
    .then(count=>{
        return res.status(200).json({totalDocs:count})
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })
}

module.exports={CreateBlog,getLatestBlog,getTrendingBlog,getFilteredBlogs,allLatestBlogCount,searchBlogCount,searchUser,getSpecificBlog,userWrittenBlogs,userWrittenBlogsCount,DeleteBlog} 