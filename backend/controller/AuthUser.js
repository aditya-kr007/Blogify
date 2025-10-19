const { scryptSync, randomBytes } = require("crypto");

const User = require('../Schema/User')
const { generateUsername } = require('../utils/generateUsername');
const { formatDataToSent } = require('../utils/formatDataToSentSignup');
const { getAuth } = require('firebase-admin/auth')

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const encryptPassword = (password, salt) => {
    return scryptSync(password, salt, 32).toString('hex');
};

const matchPassword = (password, hash) => {
    // extract salt from the hashed string
    // our hex password length is 32*2 = 64
    const salt = hash.slice(64);
    const originalPassHash = hash.slice(0, 64);
    const currentPassHash = encryptPassword(password, salt);
    return originalPassHash === currentPassHash;
};

const SignUpUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (name.length < 3) return res.status(403).json({ error: "Name must be 3 letters long" })
        if (!email.length) return res.status(403).json({ error: "Email is required" })
        if (!emailRegex.test(email)) return res.status(403).json({ error: "Email is Invalid" })
        if (!passwordRegex.test(password)) return res.status(403).json({ error: "Password should be 6 to 20 letters long and should contain alpha-numeric" })

        const salt = randomBytes(16).toString("hex");
        const hashedPassword = encryptPassword(password, salt) + salt;

        const usernameGenerated = await generateUsername(email)
        const user = await User.create({
            personal_info: {
                name,
                username: usernameGenerated,
                email,
                password: hashedPassword
            }
        })
        return res.status(200).json(formatDataToSent(user))

    } catch (error) {
        if (error.code == 11000) return res.status(500).json({ error: "Email Already Exist" })
        console.log(error)
        res.status(500).json({ error })
    }

}

const SigninUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ "personal_info.email": email })
        if (!user) {
            return res.status(404).json({ error: "User does not exist" })
        }
        if (!user.google_auth) {
            const isMatch = matchPassword(password, user.personal_info.password)
            if (!isMatch) {
                return res.status(403).json({ error: "Password is incorrect" })
            }
            if (user && isMatch) {
                return res.status(200).json(formatDataToSent(user))
            }
        }
        else {
            return res.status(403).json({ error: "Account is already created with google login instead" })
        }


    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

const GoogleAuth = async (req, res) => {
    try {
        const { token } = req.body
        const decodedUser = await getAuth().verifyIdToken(token)
        const { email, name, picture } = decodedUser
        let user = await User.findOne({ "personal_info.email": email }).select("personal_info.name personal_info.username personal_info.profile_img google_auth").then((u) => { return u || null }).catch((e) => { return res.status(500).json({ error: e.message }) })

        console.log(user)
        //login

        if (user && !user.google_auth) {
            console.log(user)
            return res.status(403).json({ error: "Email already exists, please login with password" })
        }
        else if (user && user.google_auth) {
            return res.status(200).json(formatDataToSent(user))
        }
        else if (!user) {
            //signup
            const username = await generateUsername(email)
            const user2 = await User.create({
                personal_info: { name: name, email, profile_img: picture, username },
                google_auth: true
            })

            user = user2
            return res.status(200).json(formatDataToSent(user))

        }

    } catch (error) {
        console.log(error)
        res.json({ error: error.message })
    }
}

const ChangePassword = async (req, res) => {
    const user_id = req.user
    const { currentPassword, newPassword } = req.body
    const user = await User.findOne({ _id: user_id })
    const isMatch = matchPassword(currentPassword, user.personal_info.password)
    if (!isMatch) {
        return res.status(403).json({ error: "Current password is incorrect" })
    }
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = encryptPassword(newPassword, salt) + salt;
    user.personal_info.password = hashedPassword
    await user.save()
    return res.status(200).json({ message: "Password changed successfully" })
}

module.exports = { SignUpUser, SigninUser, GoogleAuth, ChangePassword }