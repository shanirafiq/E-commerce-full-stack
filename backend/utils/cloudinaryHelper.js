const cloudinary = require("../cloudinary");

/**
 * Upload a file buffer to Cloudinary.
 * @param {Object} file - Multer file object (with .buffer from memoryStorage)
 * @param {string} folder - Cloudinary folder path (default: "folio")
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const saveLocalFile = (file, folder = "folio") => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error("No file provided for upload"));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "avif", "jfif"],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(new Error("Failed to upload image to Cloudinary"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(file.buffer);
  });
};

/**
 * Delete an image from Cloudinary by its public_id.
 * @param {string} publicId - Cloudinary public_id
 */
const deleteLocalFile = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};

module.exports = { saveLocalFile, deleteLocalFile };
