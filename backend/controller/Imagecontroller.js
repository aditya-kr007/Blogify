const multer=require('multer')

const {cloudinary} =require('../utils/cloudinary')

exports.uploadImage= async function(req,res){
    let cloudinaryRes
    if(req.file){
        cloudinaryRes=await cloudinary.uploader.upload(req.file.path,{
            upload_preset:'trials'
        })
    }
    else{
        return res.status(400).json({error:"Please provide a file"})
    }
    res.json({
        'success':1,
        "file":{
            url:cloudinaryRes?.url
        }
    })
    

}