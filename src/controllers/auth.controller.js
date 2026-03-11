const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")    

/**
 * @name registerUser
 * @description Controller function to handle user registration
 * @route POST /api/auth/register
 */

async function registerUserController(req,res){
    const { username, email, password } = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if(isUserAlreadyExists){
        if(isUserAlreadyExists.username === username){
            return res.status(400).json({
                success: false,
                message: "Username already taken"
            })
        }
        else{
            return res.status(400).json({
                success: false,
                message: "Account already exists with this email address"
            })
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const User = new userModel({
        username,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id:user._id,username: user.username,email: user.email
    }, process.env.JWT_SECRET,
    { expiresIn: "2d" })
    
    res.token("token",token)

    res.status(201).json({
        success: true,
        message: "User registered successfully", 
        user: {
            id: User._id,
            username: User.username,
            email: User.email
        }
    })
}

/**
 * @name loginUser
 * @description Controller function to handle user login
 * @route POST /api/auth/login
 */

async function loginUserController(req,res){
    const { email, password } = req.body

    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            success:false,
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            success:false,
            message: "Invalid email or password"
        })
    }
    const token = jwt.sign({
        id:user._id,username: user.username,email: user.email
    }, process.env.JWT_SECRET,
    { expiresIn: "2d" })

    res.token("token",token)

    res.status(200).json({
        status:true,
        message: "User logged in successfully",
        user:{
            id:user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutUser
 * @description Controller function to handle user logout
 * @route POST /api/auth/logout
 */

async function logoutUserController(req,res){
    const token = req.cookies.token
        if(!token){ 
            return res.status(400).json({
                success: false,
                message: "No token found"
            })
        }

        if(token){
            await tokenBlacklistModel.create({ token })
        }

        res.clearCookie("token")
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
}

/**
 * @name getMe
 * @description Controller function to get current logged in user details
 * @route GET /api/auth/getMe
 */
async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        success: true,
        message: "User details fetched successfully",
        user: { id: user._id, username: user.username, email: user.email }
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}