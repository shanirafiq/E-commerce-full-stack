const express = require("express");
const {
  register,
  verifyUser,
  resendEmail,
  login,
  logout,
  forgetPassowrd,
  verifyOtp,
  changePassword,
  changePasswordAuth,
} = require("../controllers/auth");
const { fetchUser } = require("../middleware/fetchUser");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many requests, please try again later" },
});

router.post("/register", authLimiter, register);
router.post("/verify", verifyUser);
router.post("/resend", authLimiter, resendEmail);
router.post("/login", authLimiter, login);
router.post("/logout", fetchUser, logout);
router.post("/forget", authLimiter, forgetPassowrd);
router.post("/verify-otp", authLimiter, verifyOtp);
router.post("/change-password", authLimiter, changePassword);
router.post("/change-password-auth", fetchUser, changePasswordAuth);

module.exports = router;
