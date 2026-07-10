const express = require("express");
const router = express.Router();
const { fetchUser, fetchAdmin } = require("../middleware/fetchUser");
const {
  createCategory,
  getAllCategories,
  getAllCategoriesAdmin,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const upload = require("../middleware/upload");

router.get("/all", getAllCategories);
router.get("/admin/all", fetchUser, fetchAdmin, getAllCategoriesAdmin);
router.get("/:id", getCategoryById);
router.post("/create", fetchUser, fetchAdmin, upload.single("image"), createCategory);
router.put("/:id", fetchUser, fetchAdmin, upload.single("image"), updateCategory);
router.delete("/:id", fetchUser, fetchAdmin, deleteCategory);

module.exports = router;
