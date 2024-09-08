import express from "express"
import { signUp } from "../controllers/userController.js"
import upload from "../middlewares/uploadMiddleware.js"

const router = express.Router()

router.route("/signUp").post(upload.single('profileImage') ,signUp)


export default router