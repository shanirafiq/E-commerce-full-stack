const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const SendOtp = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP - Password Reset",
      html: `
        <h2>Your Password Reset OTP</h2>
        <p>Use this code to reset your password:</p>
        <h1 style="color:#4C1D95;letter-spacing:6px;">${otp}</h1>
        <p>This code expires in 10 minutes. Do not share it with anyone.</p>
      `,
    });
    console.log("âœ… OTP email sent.");
  } catch (error) {
    console.error("âŒ OTP email error:", error.message);
    throw error;
  }
};

module.exports = { SendOtp };
