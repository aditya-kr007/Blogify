const express=require('express')
const { updateProfile } = require('../controllers/updateProfile')
const router=express.Router()
const { VerifyJwtToken } = require("../middleware/VerifyJwtToken")

router.post('/update-profile',VerifyJwtToken, updateProfile)
module.exports=router