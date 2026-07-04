const nodemailer=require('nodemailer');

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
      subject: "OTP",
      html: `
        <h2>Your Forget Password OTP is ${otp}</h2>

        <p>Please click the link below to verify your email:</p>

    
      `,
    });

    console.log("✅ Forget otp email sent.");
  }catch (error) {
    console.error(error);
    return res.status(500).json({
        success: false,
        message: error.message
    });
}
};


module.exports={SendOtp}