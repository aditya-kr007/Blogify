const express=require("express")
const {searchUser}=require('../controllers/Blog')
const {UserProfileSearch}=require('../controllers/UserProfile')
const router=express.Router()
router.post('/search-user',searchUser)
router.post('/get-profile',UserProfileSearch)
module.exports=router