import User from "../models/userModel.js"
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';;



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const signUp = async (req,res)=>{
     const {username,password,email,bio} = req.body

     if(!username || !password || !email || !bio){
        if (req.file) {
            fs.unlinkSync(req.file.path);
          }
        return res.status(400).json({
            status:"failed",
            message:"form must contain these fields",
            username:"",
            password:"",
            email:"",
            bio:""
        })
     }

     try {
        const usernameCheck = await User.findOne({username})
        if(usernameCheck){
            if(req.file){
                fs.unlinkSync(req.file.path)
            }
            return res.status(400).json({
                status:"failed",
                message:"there is already a user with this username try something else"
            })
        }

        const checkEmail = await User.findOne({email})
        if(checkEmail){
            if(req.file){
                fs.unlinkSync(req.file.path)
            }
            return res.status(400).json({
                status:"failed",
                message:"there is already a user with this email try something else"
            })
        }

        if(password.length < 6){
            if(req.file){
                fs.unlinkSync(req.file.path)
            }
            return res.status(400).json({
                status:"failed",
                message:"password must contain atleast 6 characters"
            })
        }

        const newUser = await User.create({
            username,
            password,
            email,
            bio,
            profileImage: req.file ? `uploads/${req.file.filename}` : null
        })

        await newUser.save()
        res.status(201).json({
            status:"success",
            message:"user sign up done",
            newUser
        })
     } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"something went wrong please try again lates",
            error
        })
     }
}