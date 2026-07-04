
const User = require('../models/userModel');


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
        const {id}=req.params

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
        const {id}=req.params

        const user = await User.findByIdAndUpdate(id)

        return res.status(200).json({
            status: true,
            message: "user  updated  successfully",
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

const deleteUser = async (req, res) => {

    try {
        const {id}=req.params

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


module.exports={getAllUsers,deleteUser,updatedUser,getUserById}