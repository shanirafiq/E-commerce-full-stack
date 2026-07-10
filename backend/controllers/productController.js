const Product = require("../models/productModel");

// ======================
// Create Product
// ======================
const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      userId: req.user.id,

      productImg: req.file
        ? req.file.path
        : "",

      description: req.body.description,

      productName: req.body.productName,

      productPrice: req.body.productPrice,

      brand: req.body.brand,

      category: req.body.category,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================
// Get All Products
// ======================
const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const filter = {};

    if (search) {
      filter.productName = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.productPrice = {};

      if (minPrice) {
        filter.productPrice.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.productPrice.$lte = Number(maxPrice);
      }
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price-asc") {
      sortOption = { productPrice: 1 };
    }

    if (sort === "price-desc") {
      sortOption = { productPrice: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .populate("userId", "firstName lastName email")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================
// Get Single Product
// ======================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Update Product
// ======================
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Only owner can update
    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // If a new image is uploaded, update its path
    if (req.file) {
      req.body.productImg = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        productName: req.body.productName,
        description: req.body.description,
        productPrice: req.body.productPrice,
        brand: req.body.brand,
        category: req.body.category,
        productImg: req.body.productImg || product.productImg,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Delete Product
// ======================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Only owner can delete
    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};