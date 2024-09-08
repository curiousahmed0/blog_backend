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

export const getAllUsers = async (req,res)=>{
    try {
        const users = await User.find()
        return res.status(200).json({
            status:"success",
            users
        })
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"something went wrong please try again later"
        })
    }
}


export const getUser = async (req,res)=>{
      const {id} = req.params
      try {
        const user = await User.findById(id)
        if(!user){
            return res.status(404).json({
                status:"failed",
                message:"there is no user with this id kindly provide valid id"
            })
        }
        return res.status(200).json({
            status:"success",
            user
        })
      } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"server error please try again later"
        })
      }
}


export const deleteUser = async (req,res)=>{
    const {id} = req.params
    try {
        const user = await User.findByIdAndDelete(id)
        if(!user){
            return res.status(404).json({
                status:"failed",
                message:"no user with this id"
            })
        }

        if (user.profileImage) {
            const oldImagePath = path.join(__dirname, '../../', user.profileImage);
            if (fs.existsSync(oldImagePath)) {
                try {
                    fs.unlinkSync(oldImagePath);
                    console.log('Old image deleted:', oldImagePath);
                } catch (err) {
                    console.error('Failed to delete old image:', err);
                }
            } else {
                console.log('Old image file does not exist at:', oldImagePath);
            }
        }

        return res.status(200).json({
            status:"success",
            message:"successfully deleted ",
            user
        })

    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"server error please try again later"
        })  
    }
}

export const updateUser = async (req,res)=>{
    const {id} = req.params
    const {username,email,password,bio,role} = req.body

    try {
       
     const user = await User.findById(id)
     if(!user){
        if (req.file) {
            fs.unlinkSync(req.file.path);
          }
        return res.status(404).json({
            status:"failed",
            message:"there is no user with this id"
        })
     }

     if(username && username !== user.username){
        const checkUsername = await User.findOne({username})
        if(checkUsername){
            if (req.file) {
                fs.unlinkSync(req.file.path);
              }
            return res.status(404).json({
                status:"failed",
                message:"there is already an user with this username"
            })  
        }
     }
     if(email && email !== user.email){
        const checkEmail = await User.findOne({email})
        if(checkEmail){
            if (req.file) {
                fs.unlinkSync(req.file.path);
              }
            return res.status(404).json({
                status:"failed",
                message:"there is already an user with this email"
            })  
        }
     }
     if(password && password.length < 6){
        if (req.file) {
            fs.unlinkSync(req.file.path);
          }
            return res.status(404).json({
                status:"failed",
                message:"password must be of 6 charachters"
            })  
     }

     if (req.file) {
        if (user.profileImage) {
            const oldImagePath = path.join(__dirname, '../../', user.profileImage);
            if (fs.existsSync(oldImagePath)) {
                try {
                    fs.unlinkSync(oldImagePath);
                    console.log('Old image deleted:', oldImagePath);
                } catch (err) {
                    console.error('Failed to delete old image:', err);
                }
            } else {
                console.log('Old image file does not exist at:', oldImagePath);
            }
        }
        user.profileImage = `uploads/${req.file.filename}`;
    }
    user.username = username || user.username
    user.email = email || user.email
    user.password = password || user.password
    user.role = role || user.role
    user.bio = bio || user.bio

    const updatedUser = await user.save()

     return res.status(200).json({
        status:"success",
        message:"successfully updated",
        updatedUser
     })
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"server error please  try again later"
        })
    }
}