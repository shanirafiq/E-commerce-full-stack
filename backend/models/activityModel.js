const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: String,
      required: true,
      enum: [
        "user_registered",
        "user_login",
        "product_created",
        "product_updated",
        "product_deleted",
        "review_created",
        "review_deleted",
        "user_blocked",
        "user_unblocked",
        "user_deleted",
        "category_created",
        "category_updated",
        "category_deleted",
      ],
    },
    entityType: {
      type: String,
      enum: ["user", "product", "review", "category", "auth"],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
