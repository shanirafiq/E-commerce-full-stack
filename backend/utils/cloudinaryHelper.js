const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "..", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Get the relative URL path for a locally saved file.
 * @param {Object} file - Multer file object (with .filename)
 * @returns {{ url: string, publicId: string }}
 */
const saveLocalFile = (file) => {
  if (!file || !file.filename) {
    throw new Error("No file provided for upload");
  }

  // Store as relative path: "uploads/filename.ext"
  const url = `uploads/${file.filename}`;

  return {
    url,
    publicId: file.filename, // filename acts as the ID for local files
  };
};

/**
 * Delete a locally stored file by its filename.
 * @param {string} publicId - The filename to delete
 */
const deleteLocalFile = (publicId) => {
  if (!publicId) return;

  const filePath = path.join(uploadsDir, publicId);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = { saveLocalFile, deleteLocalFile };
