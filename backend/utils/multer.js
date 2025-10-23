const multer=require('multer')
const path=require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/temp/`))
    },
    filename: function (req, file, cb) {
        const filename=`${Date.now()}- ${file.originalname}`
        cb(null,filename)
    }
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png'
    )
        cb(null, true); // this means file should be accepted
    else cb(null, false); // this means file should not be accepted
};


exports.upload=multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*10
    },
    fileFilter:fileFilter
})