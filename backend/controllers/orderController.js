const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// Place a new COD order
const placeOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Order must contain at least one item",
    });
  }

  if (
    !shippingAddress ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.postalCode ||
    !shippingAddress.phone
  ) {
    return res.status(400).json({
      success: false,
      message: "Complete shipping address is required",
    });
  }

  // Validate products and calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found: ${item.name}`,
      });
    }

    const itemTotal = product.productPrice * item.qty;
    subtotal += itemTotal;

    orderItems.push({
      productId: product._id,
      name: product.productName,
      price: product.productPrice,
      qty: item.qty,
      color: item.color || "Default",
      size: item.size || "Standard",
      image: product.productImg,
    });
  }

  // Calculate shipping (free over $50)
  const shippingCost = subtotal > 50 ? 0 : 6;
  const totalAmount = subtotal + shippingCost;

  // Create order
  const order = new Order({
    userId: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || "COD",
    subtotal,
    shippingCost,
    totalAmount,
  });

  await order.save();

  return res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order,
  });
};

// Get user's orders
const getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  return res.status(200).json({
    success: true,
    data: orders,
  });
};

// Get order details by ID
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Check if user owns the order or is admin
  if (
    order.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  return res.status(200).json({
    success: true,
    data: order,
  });
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "firstName lastName email")
    .sort({ createdAt: -1 })
    .limit(100);

  return res.status(200).json({
    success: true,
    data: orders,
  });
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;

  if (!orderStatus) {
    return res.status(400).json({
      success: false,
      message: "Order status is required",
    });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  order.orderStatus = orderStatus;

  // Mark as paid if delivered (for COD)
  if (orderStatus === "delivered" && order.paymentMethod === "COD") {
    order.paymentStatus = "paid";
  }

  await order.save();

  return res.status(200).json({
    success: true,
    message: "Order status updated",
    data: order,
  });
};

// Cancel order (user or admin)
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Check if user owns the order or is admin
  if (
    order.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  // Only pending orders can be cancelled by users
  if (req.user.role !== "admin" && order.orderStatus !== "pending") {
    return res.status(400).json({
      success: false,
      message: "Only pending orders can be cancelled",
    });
  }

  order.orderStatus = "cancelled";
  await order.save();

  return res.status(200).json({
    success: true,
    message: "Order cancelled",
    data: order,
  });
};

module.exports = {
  placeOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
