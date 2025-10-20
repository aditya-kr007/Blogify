const {SignUpUser,SigninUser,GoogleAuth, ChangePassword}=require('../controllers/AuthUser')
const express=require("express")
const router=express.Router()
const { VerifyJwtToken } = require("../middleware/VerifyJwtToken")

router.post('/signup',SignUpUser)
router.post('/signin',SigninUser)
router.post('/google-auth',GoogleAuth)
router.post('/change-password',VerifyJwtToken,ChangePassword)

module.exports=router