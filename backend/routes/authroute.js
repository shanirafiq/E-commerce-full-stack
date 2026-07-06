const express= require("express");
const {register,verifyUser,resendEmail,login,logout,forgetPassowrd,verifyOtp,changePassword
}=require('../controllers/auth');
const {fetchUser,fetchAdmin }= require("../middleware/fetchUser");

const router = express.Router();


// Verify Email
router.post("/register", register);
router.post("/verify", verifyUser);
router.post("/resend", resendEmail);
router.post("/login", login);
router.post("/logout",fetchUser, logout);
router.post("/forget", forgetPassowrd);
router.post("/verify-otp", verifyOtp);
router.post("/change-password", changePassword);


module.exports=router