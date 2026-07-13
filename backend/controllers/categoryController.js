const Category = require("../models/categoryModel");
const { saveLocalFile, deleteLocalFile } = require("../utils/cloudinaryHelper");
const { logActivity } = require("../utils/activityLogger");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    let imageData = { url: "", publicId: "" };
    if (req.file) {
      const uploaded = await saveLocalFile(req.file, "folio/categories");
      imageData = { url: uploaded.url, publicId: uploaded.publicId };
    }

    const category = await Category.create({
      name,
      description: description || "",
      image: imageData.url,
      imagePublicId: imageData.publicId,
    });

    await logActivity({
      userId: req.user._id,
      action: "category_created",
      entityType: "category",
      entityId: category._id,
      description: `Category "${category.name}" created`,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const { name, description, isActive } = req.body;

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    if (req.file) {
      const uploaded = await saveLocalFile(req.file, "folio/categories");
      if (category.imagePublicId) {
        await deleteLocalFile(category.imagePublicId);
      }
      category.image = uploaded.url;
      category.imagePublicId = uploaded.publicId;
    }

    await category.save();

    await logActivity({
      userId: req.user._id,
      action: "category_updated",
      entityType: "category",
      entityId: category._id,
      description: `Category "${category.name}" updated`,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (category.imagePublicId) {
      await deleteLocalFile(category.imagePublicId);
    }

    await Category.findByIdAndDelete(req.params.id);

    await logActivity({
      userId: req.user._id,
      action: "category_deleted",
      entityType: "category",
      entityId: category._id,
      description: `Category "${category.name}" deleted`,
    });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getAllCategoriesAdmin,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
