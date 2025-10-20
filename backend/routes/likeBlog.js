const express=require("express")
const { likedBlog ,isLikedByUser} = require("../controllers/likeBlog")
const { VerifyJwtToken } = require("../middleware/VerifyJwtToken")
const router=express.Router()

router.post('/like-blog',VerifyJwtToken,likedBlog)
router.post('/isLiked-by-user',VerifyJwtToken,isLikedByUser)

module.exports=router