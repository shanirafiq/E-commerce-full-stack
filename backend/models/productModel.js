const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productImg: {
      type: String,
    },

    description: {
      type: String,
    },

    productName: {
      type: String,
    },

    productPrice: {
      type: Number,
    },

    brand: {
      type: String,
    },

    category: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Products", productSchema);