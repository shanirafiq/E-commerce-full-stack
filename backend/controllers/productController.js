const Product = require("../models/productModel");
const { saveLocalFile, deleteLocalFile } = require("../utils/cloudinaryHelper");
const { logActivity } = require("../utils/activityLogger");

const isOwnerOrAdmin = (product, user) =>
  product.userId.toString() === user._id.toString() || user.role === "admin";

const createProduct = async (req, res) => {
  try {
    const { productName, description, productPrice, brand, category } = req.body;

    if (!productName || !productPrice) {
      return res.status(400).json({
        success: false,
        message: "Product name and price are required",
      });
    }

    let imageData = { url: "", publicId: "" };
    if (req.file) {
      const uploaded = saveLocalFile(req.file);
      imageData = { url: uploaded.url, publicId: uploaded.publicId };
    }

    const product = await Product.create({
      userId: req.user._id,
      productImg: imageData.url,
      productImgPublicId: imageData.publicId,
      description: description || "",
      productName,
      productPrice: Number(productPrice),
      brand: brand || "",
      category: category || "Uncategorized",
    });

    await logActivity({
      userId: req.user._id,
      action: "product_created",
      entityType: "product",
      entityId: product._id,
      description: `Product "${product.productName}" created`,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
      userId,
    } = req.query;

    const filter = {};

    if (search) {
      filter.productName = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (userId) {
      filter.userId = userId;
    }

    if (minPrice || maxPrice) {
      filter.productPrice = {};
      if (minPrice) filter.productPrice.$gte = Number(minPrice);
      if (maxPrice) filter.productPrice.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { productPrice: 1 };
    if (sort === "price-desc") sortOption = { productPrice: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate("userId", "firstName lastName email avatar")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("userId", "firstName lastName email avatar")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!isOwnerOrAdmin(product, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updates = {};
    const { productName, description, productPrice, brand, category } = req.body;

    if (productName) updates.productName = productName;
    if (description !== undefined) updates.description = description;
    if (productPrice) updates.productPrice = Number(productPrice);
    if (brand !== undefined) updates.brand = brand;
    if (category) updates.category = category;

    if (req.file) {
      const uploaded = saveLocalFile(req.file);
      if (product.productImgPublicId) {
        deleteLocalFile(product.productImgPublicId);
      }
      updates.productImg = uploaded.url;
      updates.productImgPublicId = uploaded.publicId;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    await logActivity({
      userId: req.user._id,
      action: "product_updated",
      entityType: "product",
      entityId: product._id,
      description: `Product "${updatedProduct.productName}" updated`,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!isOwnerOrAdmin(product, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (product.productImgPublicId) {
      deleteLocalFile(product.productImgPublicId);
    }

    await Product.findByIdAndDelete(req.params.id);

    await logActivity({
      userId: req.user._id,
      action: "product_deleted",
      entityType: "product",
      entityId: product._id,
      description: `Product "${product.productName}" deleted`,
    });

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
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
