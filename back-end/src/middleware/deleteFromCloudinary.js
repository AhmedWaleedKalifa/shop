const cloudinary = require("../config/cloudinary");

const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;

  try {

    let parts = imageUrl.split("/upload/")[1];  
    if (!parts) return;

    parts = parts.replace(/^v[0-9]+\/+/, "");

    const publicId = parts.replace(/\.[a-zA-Z0-9]+$/, "");

    await cloudinary.uploader.destroy(publicId);

    console.log("Deleted image from Cloudinary:", publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};

module.exports = deleteImageFromCloudinary;
