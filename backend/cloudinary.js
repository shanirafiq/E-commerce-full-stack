const cloudinary = require("cloudinary").v2;
require("dotenv").config();
console.log(cloudinary.config());
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

console.log("=== Cloudinary Config ===");
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("CLOUD_API_KEY:", process.env.CLOUD_API_KEY);
console.log("CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET ? "✅ Loaded" : "❌ Missing");

module.exports = cloudinary;