const express = require("express");
const router = express.Router();
const { fetchUser, fetchAdmin, optionalAuth } = require("../middleware/fetchUser");
const {
  createReview,
  getAllReviews,
  getMyReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.post("/create", fetchUser, createReview);
router.get("/all", optionalAuth, getAllReviews);
router.get("/my-reviews", fetchUser, getMyReviews);
router.get("/:id", optionalAuth, getReviewById);
router.put("/:id", fetchUser, updateReview);
router.delete("/:id", fetchUser, deleteReview);

module.exports = router;
