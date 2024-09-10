import express from "express"
import { protect } from "../middlewares/authMiddleware.js"
import { restrictTo } from "../middlewares/restrictToMiddleware.js"
import { addCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from "../controllers/categoryController.js"

const router = express.Router()

router.route("/").get(protect,restrictTo("admin","author","reader"),getAllCategories)
router.route("/:id").delete(protect,restrictTo("admin"),deleteCategory).put(protect,restrictTo("admin"),updateCategory).get(protect,restrictTo("admin","author","reader"),getCategory)
router.route("/create").post(protect,restrictTo("admin"),addCategory)

export default router