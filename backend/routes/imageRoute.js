const express=require("express")
const {upload}=require("../utils/multer")
const router=express.Router()
const imageController=require('../controllers/ImageController')

router.post('/editor',upload.single('image'),imageController.uploadImage)

module.exports=router