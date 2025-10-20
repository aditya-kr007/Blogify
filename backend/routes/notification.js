const express=require("express")
const { getNotification, getNotificationData, allNotificationCount } = require("../controllers/Notification")
const router=express.Router()
const { VerifyJwtToken } = require("../middleware/VerifyJwtToken")

router.get('/new-notification',VerifyJwtToken, getNotification)
router.post("/notifications",VerifyJwtToken,getNotificationData)
router.post("/all-notificationCount",VerifyJwtToken,allNotificationCount)
module.exports=router