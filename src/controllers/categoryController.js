import Category from "../models/categoryModal.js";


export const addCategory = async (req,res)=>{
    const {name,description} = req.body
    if(!name || !description){
        return res.status(400).json({
            status:"failed",
            message:"data fields cant be empty your data should be of the form",
            data:{
                name:"",
                description:""
            }
        })
    }
    try {
        const checkName = await Category.findOne({name})
        if(checkName){
            return res.status(400).json({
                status:"failed",
                message:"this name already exist please try some different name"
            })
        }

        const newCategory = await Category.create({
            name,description
        })
        
        await newCategory.save()

        return res.status(201).json({
            status:"success",
            message:"new category added successfully",
            newCategory
        })

    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"something went wrong please try again later"
        })
    }
}


export const getAllCategories = async (req,res)=>{
    try {
       const categories = await Category.find()
       return res.status(200).json({
        status:"success",
        categories
       })      
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"something went wrong please try again later"
        })
    }
}

export const getCategory = async (req,res)=>{
    const {id} = req.params
    try {
        const category = await Category.findById(id)
        if(!category){
            return res.status(404).json({
                status:"failed",
                message:"there is no category with this id"
            })
        }
       
        return res.status(200).json({
            status:"success",
            category
        })
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"something went wrong please try again later"
        })
    }
}

export const deleteCategory = async (req,res)=>{
    const {id} = req.params
    try {
        const category = await Category.findByIdAndDelete(id)
        if(!category){
            return res.status(404).json({
                status:"failed",
                message:"there is no category with this id"
            })
        }
        return res.status(200).json({
            status:"success",
            message:"category deleted successfully",
            category
        })
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"something went wrong"
        })
    }
}


export const updateCategory = async (req,res)=>{
    const {id} = req.params
    const {name,description} = req.body
    try {
        const category = await Category.findByIdAndUpdate(id)
        if(!category){
            return res.status(404).json({
                status:"failed",
                message:"there is no category with this id"
            })
        }
      
        if(name && name !== category.name){
            const checkName = await Category.findOne({name})
            if(checkName){
                return res.status(400).json({
                    status:"failed",
                    message:"there is already an category with this name "
                })
            }
        }

        category.name = name || category.name
        category.description = description || category.description

        await category.save()

        return res.status(200).json({
            status:"success",
            message:"date updated successfully",
            category
        })
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"something went wrong please try again later"
        })
    }
}