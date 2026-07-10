const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const allowed = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".jfif",
    ".gif",
    ".bmp",
    ".svg",
    ".avif",
  ];

  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."));
  }
};
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;