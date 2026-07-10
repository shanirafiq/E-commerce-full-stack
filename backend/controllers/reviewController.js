const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const { logActivity } = require("../utils/activityLogger");

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Product, rating, and comment are required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existing = await Review.findOne({
      productId,
      userId: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      userId: req.user._id,
      productId,
      rating: Number(rating),
      comment,
    });

    const populated = await Review.findById(review._id)
      .populate("userId", "firstName lastName avatar")
      .populate("productId", "productName productImg");

    await logActivity({
      userId: req.user._id,
      action: "review_created",
      entityType: "review",
      entityId: review._id,
      description: `Review added for "${product.productName}"`,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const { productId, userId, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (productId) filter.productId = productId;
    if (userId) filter.userId = userId;

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("userId", "firstName lastName avatar email")
        .populate("productId", "productName productImg")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Review.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate("productId", "productName productImg")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("userId", "firstName lastName avatar")
      .populate("productId", "productName productImg");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const isOwner = review.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { rating, comment, isApproved } = req.body;

    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment;
    if (isAdmin && isApproved !== undefined) review.isApproved = isApproved;

    await review.save();

    const populated = await Review.findById(review._id)
      .populate("userId", "firstName lastName avatar")
      .populate("productId", "productName productImg");

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const isOwner = review.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    await logActivity({
      userId: req.user._id,
      action: "review_deleted",
      entityType: "review",
      entityId: review._id,
      description: "Review deleted",
    });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getMyReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
