const User = require("../models/userModel");
const Product = require("../models/productModel");
const Review = require("../models/reviewModel");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryHelper");
const { logActivity } = require("../utils/activityLogger");

const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.otp;
  delete obj.token;
  return obj;
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -token")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const user = await User.findById(id).select("-password -otp -token");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatedUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { firstName, lastName, email, phoneNumber, address, city, postalCode, role } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file, "folio/avatars");
      if (user.avatarPublicId) {
        await deleteFromCloudinary(user.avatarPublicId);
      }
      user.avatar = uploaded.url;
      user.avatarPublicId = uploaded.publicId;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email.toLowerCase();
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (postalCode !== undefined) user.postalCode = postalCode;

    if (req.user.role === "admin" && role) {
      user.role = role;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId);
    }

    const products = await Product.find({ userId: id });
    for (const product of products) {
      if (product.productImgPublicId) {
        await deleteFromCloudinary(product.productImgPublicId);
      }
    }
    await Product.deleteMany({ userId: id });
    await Review.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);

    await logActivity({
      userId: req.user._id,
      action: "user_deleted",
      entityType: "user",
      entityId: id,
      description: `Admin deleted user ${user.firstName} ${user.lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot block your own account",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    await logActivity({
      userId: req.user._id,
      action: user.isBlocked ? "user_blocked" : "user_unblocked",
      entityType: "user",
      entityId: user._id,
      description: `Admin ${user.isBlocked ? "blocked" : "unblocked"} ${user.firstName} ${user.lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      data: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [productCount, reviewCount] = await Promise.all([
      Product.countDocuments({ userId }),
      Review.countDocuments({ userId }),
    ]);

    return res.status(200).json({
      success: true,
      data: { productCount, reviewCount },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  updatedUser,
  getUserById,
  toggleBlockUser,
  getUserStats,
};
