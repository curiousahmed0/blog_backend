import express from "express"
import { getAllUsers, signUp,getUser,deleteUser,updateUser } from "../controllers/userController.js"
import upload from "../middlewares/uploadMiddleware.js"
import { login, refreshAccessToken } from "../controllers/authController.js"
import { protect } from "../middlewares/authMiddleware.js"
import { restrictTo } from "../middlewares/restrictToMiddleware.js"

const router = express.Router()

router.route("/signUp").post(upload.single('profileImage') ,signUp)
router.route("/login").post(login)
router.route("/getAll").get(protect,restrictTo("admin") ,getAllUsers)
router.route("/refreshAccess").post(refreshAccessToken)
router.route("/:id").get(protect,restrictTo('admin'),getUser).delete(protect,restrictTo('admin'),deleteUser).put(protect,restrictTo('admin'),upload.single('profileImage') ,updateUser)


export default router