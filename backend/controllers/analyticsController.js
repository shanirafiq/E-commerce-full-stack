const User = require("../models/userModel");
const Product = require("../models/productModel");
const Review = require("../models/reviewModel");
const Activity = require("../models/activityModel");

const getAdminDashboard = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalReviews, recentActivities] =
      await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Review.countDocuments(),
        Activity.find()
          .populate("userId", "firstName lastName avatar")
          .sort({ createdAt: -1 })
          .limit(10)
          .lean(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalReviews,
        recentActivities,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const userFilter = isAdmin ? {} : { userId: req.user._id };

    const [
      totalProducts,
      productsByCategory,
      reviewStats,
      userStats,
      monthlyProducts,
      monthlyReviews,
      monthlyUsers,
    ] = await Promise.all([
      Product.countDocuments(userFilter),

      Product.aggregate([
        ...(isAdmin ? [] : [{ $match: { userId: req.user._id } }]),
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { category: "$_id", count: 1, _id: 0 } },
      ]),

      Review.aggregate([
        ...(isAdmin
          ? []
          : [{ $match: { userId: req.user._id } }]),
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgRating: { $avg: "$rating" },
            ratings: { $push: "$rating" },
          },
        },
      ]),

      isAdmin
        ? User.aggregate([
            {
              $group: {
                _id: "$role",
                count: { $sum: 1 },
              },
            },
          ])
        : Promise.resolve([]),

      Product.aggregate([
        ...(isAdmin ? [] : [{ $match: { userId: req.user._id } }]),
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
          $project: {
            month: {
              $concat: [
                { $toString: "$_id.year" },
                "-",
                {
                  $toString: {
                    $cond: [
                      { $lt: ["$_id.month", 10] },
                      { $concat: ["0", { $toString: "$_id.month" }] },
                      { $toString: "$_id.month" },
                    ],
                  },
                },
              ],
            },
            count: 1,
            _id: 0,
          },
        },
      ]),

      Review.aggregate([
        ...(isAdmin ? [] : [{ $match: { userId: req.user._id } }]),
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
          $project: {
            month: {
              $concat: [
                { $toString: "$_id.year" },
                "-",
                {
                  $toString: {
                    $cond: [
                      { $lt: ["$_id.month", 10] },
                      { $concat: ["0", { $toString: "$_id.month" }] },
                      { $toString: "$_id.month" },
                    ],
                  },
                },
              ],
            },
            count: 1,
            _id: 0,
          },
        },
      ]),

      isAdmin
        ? User.aggregate([
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
              $project: {
                month: {
                  $concat: [
                    { $toString: "$_id.year" },
                    "-",
                    {
                      $toString: {
                        $cond: [
                          { $lt: ["$_id.month", 10] },
                          { $concat: ["0", { $toString: "$_id.month" }] },
                          { $toString: "$_id.month" },
                        ],
                      },
                    },
                  ],
                },
                count: 1,
                _id: 0,
              },
            },
          ])
        : Promise.resolve([]),
    ]);

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (reviewStats[0]?.ratings) {
      reviewStats[0].ratings.forEach((r) => {
        ratingDistribution[r] = (ratingDistribution[r] || 0) + 1;
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        productsByCategory,
        reviewsOverview: {
          total: reviewStats[0]?.total || 0,
          avgRating: reviewStats[0]?.avgRating
            ? Number(reviewStats[0].avgRating.toFixed(1))
            : 0,
          ratingDistribution,
        },
        userStatistics: userStats.map((s) => ({
          role: s._id,
          count: s.count,
        })),
        monthlyData: {
          products: monthlyProducts,
          reviews: monthlyReviews,
          users: monthlyUsers,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAdminDashboard, getAnalytics };
