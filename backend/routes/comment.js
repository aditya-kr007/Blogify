const express=require("express")
const { VerifyJwtToken } = require("../middleware/VerifyJwtToken")
const { commentOnBlog, getComment, getReplies, deleteComments } = require("../controllers/comment")

const router=express.Router()

router.post("/add-comment",VerifyJwtToken,commentOnBlog)
router.post("/get-comment",getComment)
router.post('/get-replies',getReplies)
router.post('/delete-comment',VerifyJwtToken,deleteComments)
module.exports=router