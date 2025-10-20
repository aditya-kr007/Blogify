const express=require("express")
const { getLatestBlog, getTrendingBlog,getFilteredBlogs,allLatestBlogCount,searchBlogCount,getSpecificBlog, userWrittenBlogs, userWrittenBlogsCount } = require("../controllers/Blog")
const router=express.Router()
const { VerifyJwtToken } = require("../middleware/VerifyJwtToken")

router.post('/latest-blog', getLatestBlog)
router.get('/trending-blog',getTrendingBlog)
router.post('/search-blog',getFilteredBlogs)
router.post('/all-latest-blog-count',allLatestBlogCount)
router.post('/search-blog-count',searchBlogCount)
router.post('/get-blog',getSpecificBlog)
router.post('/user-written-blogs',VerifyJwtToken ,userWrittenBlogs)
router.post('/user-blog-count',VerifyJwtToken,userWrittenBlogsCount)
module.exports=router