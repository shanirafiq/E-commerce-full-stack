
const User = require('../models/userModel');
const cloudinary = require("../cloudinary");


const getAllUsers = async (req, res) => {

    try {

        const allusers = await User.find();

        return res.status(200).json({
            status: true,
            message: "All users  get successfully",
            users: allusers,
        })



    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error occure "
        })
    }
}

const getUserById = async (req, res) => {

    try {
        const { id } = req.params

        const user = await User.findById(id)

        return res.status(200).json({
            status: true,
            message: "user  get successfully",
            users: user,
        })



    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error occure "
        })
    }
}
const updatedUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      city,
      postalCode,
    } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check email already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Save avatar path
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.city = city || user.city;
    user.postalCode = postalCode || user.postalCode;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {

    try {
        const { id } = req.params

        const user = await User.findByIdAndDelete(id)

        return res.status(200).json({
            status: true,
            message: "user  deleted  successfully",
            users: user,
        })



    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error occure "
        })
    }
}


module.exports = { getAllUsers, deleteUser, updatedUser, getUserById }