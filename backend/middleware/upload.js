const multer = require("multer");
const path = require("path");

// Use memory storage so files can be streamed directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".jfif", ".gif", ".bmp", ".avif"];

  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
