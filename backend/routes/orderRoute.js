const express = require("express");
const router = express.Router();
const { fetchUser, fetchAdmin } = require("../middleware/fetchUser");
const {
  placeOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

// User routes
router.post("/place-order", fetchUser, placeOrder);
router.get("/my-orders", fetchUser, getUserOrders);
router.get("/order-detail/:id", fetchUser, getOrderById);
router.put("/cancel-order/:id", fetchUser, cancelOrder);

// Admin routes
router.get("/all-orders", fetchUser, fetchAdmin, getAllOrders);
router.put("/update-status/:id", fetchUser, fetchAdmin, updateOrderStatus);

module.exports = router;
