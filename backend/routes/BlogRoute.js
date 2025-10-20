const express=require("express")
const { CreateBlog, DeleteBlog } = require("../controllers/Blog")
const { VerifyJwtToken } = require("../middleware/VerifyJwtToken")
const router=express.Router()

router.post('/create-blog',VerifyJwtToken, CreateBlog)
router.post('/delete-blog',VerifyJwtToken,DeleteBlog)
module.exports=router