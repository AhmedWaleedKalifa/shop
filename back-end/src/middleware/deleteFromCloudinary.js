// Add this import at the top of deleteFromCloudinary.js
const cloudinary = require("../config/cloudinary"); // ← ADD THIS LINE

const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl) {
    console.log("❌ No image URL provided");
    return { success: false, error: "No URL provided" };
  }

  try {
    console.log(`🖼️ Processing Cloudinary deletion for: ${imageUrl}`);
    
    // Method 1: Extract public ID from Cloudinary URL
    let publicId;
    
    // If URL contains /upload/ pattern
    if (imageUrl.includes('/upload/')) {
      const parts = imageUrl.split('/upload/');
      if (parts.length > 1) {
        // Get everything after /upload/ and remove file extension
        publicId = parts[1].split('.')[0];
        // Remove version prefix if present (v1234567890/)
        publicId = publicId.replace(/^v\d+\//, '');
      }
    }
    
    // If still no publicId, try to extract from filename
    if (!publicId) {
      const filename = imageUrl.split('/').pop();
      publicId = filename.split('.')[0];
    }

    if (!publicId) {
      console.log("❌ Could not extract public ID from URL:", imageUrl);
      return { success: false, error: "Could not extract public ID" };
    }

    console.log(`☁️ Deleting from Cloudinary with public ID: ${publicId}`);
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    console.log(`📊 Cloudinary deletion result:`, result);
    
    if (result.result === 'ok') {
      console.log("✅ Successfully deleted image from Cloudinary:", publicId);
      return { success: true, publicId, result };
    } else {
      console.log("❌ Cloudinary deletion failed:", result.result);
      return { success: false, publicId, result };
    }
    
  } catch (error) {
    console.error("💥 Cloudinary delete error:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = deleteImageFromCloudinary;