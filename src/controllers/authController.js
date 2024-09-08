import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import bcrypt from "bcrypt"

const generateAccessToken = (user)=>{
    return jwt.sign({
        id:user._id,role:user.role
    },process.env.ACCESS_SECRET,{expiresIn:"15m"})
}


const generateRefreshToken = (user)=>{
    return jwt.sign({
        id:user._id
    },process.env.REFRESH_SECRET,{expiresIn:"7d"})
}


const login = async (req,res)=>{
    const {username,password} = req.body
    try {
        if(!username || !password){
            return res.status(400).json({
                status:"failed",
                message:"username and password are required "
            })
        }
        
        const user = await User.findOne({username})

        if(!user){
            return res.status(400).json({
                status:"failed",
                message:"invalid username please enter valid one "
            })
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({
                status:"failed",
                message:"invalid password please enter valid one "
            })
        }

       const refreshToken = generateRefreshToken(user)
       const accessToken =  generateAccessToken(user)

        user.refreshToken = refreshToken
        await user.save() 

        res.status(200).json({
            status:"success",
            accessToken,
            refreshToken,
           user:{
            id:user._id,
            username:user.username,
            role: user.role,
            email:user.email,
           }
        })

    } catch (error) {
        res.status(500).json({
            status:"failed",
            message:"server error something went wrong",
            error:error
        })
    }
}



export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ status: 'failed', message: 'Refresh token not provided' });
    }

    try {
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ status: 'failed', message: 'Invalid refresh token' });
        }

     
        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ status: 'failed', message: 'Invalid refresh token' });
            }

        
            const newAccessToken = generateAccessToken(user);

            res.status(200).json({
                status: 'success',
                accessToken: newAccessToken,
            });
        });
    } catch (error) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
};

export const logOut = async (req,res)=>{
    const {refreshToken} = req.body
    if(!refreshToken){
        return res.status(400).json({
            status:"failed",
            message:"please provided refresh Token"
        })
    }

    try {
        const user = await User.findOne({refreshToken})
        if(!user){
            return res.status(400).json({
                status:"failed",
                message:"invalid refresh token provide valid one "
            })  
        }
        user.refreshToken = null
        await user.save()

        res.status(200).json({
            status:"success",
            message:"succesfully logged out"
        })
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"something went wrong",
            error
        })
    }
}
