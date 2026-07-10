const express = require("express");
const router = express.Router();
const { fetchUser, fetchAdmin, optionalAuth } = require("../middleware/fetchUser");
const {
  createProduct,
  getAllProducts,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const upload = require("../middleware/upload");

router.post("/create", fetchUser, upload.single("productImg"), createProduct);
router.get("/get-products", optionalAuth, getAllProducts);
router.get("/my-products", fetchUser, getMyProducts);
router.get("/detail-product/:id", optionalAuth, getProductById);
router.put("/update-product/:id", fetchUser, upload.single("productImg"), updateProduct);
router.delete("/del-product/:id", fetchUser, deleteProduct);

module.exports = router;
