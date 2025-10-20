const express=require('express')
const { updateProfileImage } = require('../controllers/ProfileeImage')
const { VerifyJwtToken } = require("../middleware/VerifyJwtToken")

const router=express.Router()

router.post('/update-profile-img',VerifyJwtToken, updateProfileImage)
module.exports=router