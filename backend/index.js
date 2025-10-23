const express = require("express")
const dotenv = require('dotenv')
dotenv.config()
const PORT = 5000
const app = express()
const mongoose = require("mongoose")
const UserRoute = require('./routes/AuthUser')
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const cors = require('cors')
const admin = require("firebase-admin")
const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};
const uploadRoute = require('./routes/imageRoute');
const BlogRoute=require('./routes/BlogRoute')
const getBlog=require('./routes/getBlog')
const getUser=require('./routes/userRoute')
const likeBlog=require('./routes/likeBlog')
const commentBlog=require('./routes/comment')
const updateProfileImage=require('./routes/profileImage')
const updateProfile=require('./routes/updateProfile')
const newNotification=require('./routes/notification')


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:"https://mern-blogs-b15a6.firebaseio.com"
});


mongoose.connect(process.env.MONGO_DB_URI, { autoIndex: true })
    .then(() => { console.log("Mongodb connected Successfully") })
    


app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
// app.use(express.static(__dirname,'./public'))

app.use(express.static(__dirname + '../../frontend/dist/index.html'))
app.use('/', getUser)
app.use('/',getBlog)
app.use('/api/auth', UserRoute)

app.use('/',uploadRoute)
app.use('/',BlogRoute)
app.use('/',likeBlog)
app.use('/',commentBlog)

app.use('/',updateProfileImage)
app.use('/',updateProfile)
app.use('/',newNotification)
app.listen(PORT, () => { console.log(`Listening to the PORT ${PORT}`) })