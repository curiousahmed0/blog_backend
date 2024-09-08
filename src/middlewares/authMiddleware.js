import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

export const protect = async (req,res,next)=>{
    let  token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
       token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        return res.status(400).json({
            status:"failed",
            message:"unauthorized there is no token"
        })
    }

    try {
        const decoded = jwt.verify(token,process.env.ACCESS_SECRET)
        req.user = await User.findById(decoded.id).select("-password")
        next()
    } catch (error) {
       return  res.status(400).json({
        status:"failed",
        message:"token expired or something",
        error
       })
    }
}