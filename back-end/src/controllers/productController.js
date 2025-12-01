const { connect } = require("http2");
const prisma = require("../config/prisma");
const upload = require("../middleware/uploadProduct");
const deleteImageFromCloudinary = require("../middleware/deleteFromCloudinary");

async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      price,
      material,
      quantity,
      status,
      discount,
      sku,
      categoryIds // This is coming as array from Postman
    } = req.body;

    let { productSizes, productColors, productImages } = req.body;

    const userId = req.user.id;

    if (!name || !description || !price) {
      return res.status(400).json({
        error: "You should fill name, description and price fields",
      });
    }

    const data = {
      name,
      description,
      price: Number(price),
      userId,
    };

    // Image handling
    let imageFiles = [];
    if (req.files && req.files.length > 0) {
      imageFiles = req.files.map((file, index) => ({
        imageUrl: file.path,
        altText: `${name}-image-${index + 1}`,
        isPrimary: index === 0,
        displayOrder: index + 1,
      }));

      data.productImages = {
        create: imageFiles,
      };
    }

    // Handle categoryIds - FIXED for Postman array input
    let categoryIdsArray = [];

    if (categoryIds) {
      // If it's already an array (from Postman), use it directly
      if (Array.isArray(categoryIds)) {
        categoryIdsArray = [...categoryIds];
      } 
      // If it's a string (from form data), parse it
      else if (typeof categoryIds === 'string') {
        try {
          const parsed = JSON.parse(categoryIds);
          if (Array.isArray(parsed)) {
            categoryIdsArray = parsed;
          } else {
            return res.status(400).json({ error: "categoryIds must be an array" });
          }
        } catch (e) {
          return res.status(400).json({
            error: "Invalid categoryIds JSON format",
            details: e.message,
          });
        }
      } else {
        return res.status(400).json({ error: "categoryIds must be an array" });
      }
    }

    // Add the hardcoded category
    if (!categoryIdsArray.includes(process.env.ALL_PRODUCTS_CATEGORY)) {
      categoryIdsArray.push(process.env.ALL_PRODUCTS_CATEGORY);
    }

    // Connect categories
    if (categoryIdsArray.length > 0) {
      data.categories = {
        connect: categoryIdsArray.map((id) => ({ id })),
      };
    }

    // Parse productSizes if it's a string
    if (productSizes && typeof productSizes === 'string') {
      try {
        productSizes = JSON.parse(productSizes);
        if (!Array.isArray(productSizes)) {
          return res.status(400).json({ error: "productSizes must be an array" });
        }
      } catch (e) {
        return res.status(400).json({
          error: "Invalid productSizes JSON format",
          details: e.message,
        });
      }
    }

    // Parse productColors if it's a string
    if (productColors && typeof productColors === 'string') {
      try {
        productColors = JSON.parse(productColors);
        if (!Array.isArray(productColors)) {
          return res.status(400).json({ error: "productColors must be an array" });
        }
      } catch (e) {
        return res.status(400).json({
          error: "Invalid productColors JSON format",
          details: e.message,
        });
      }
    }

    // Handle product sizes
    if (productSizes && Array.isArray(productSizes) && productSizes.length > 0) {
      data.productSizes = {
        create: productSizes.map((e) => ({
          size: e.size,
          sizeSymbol: e.sizeSymbol,
        })),
      };
    }

    // Handle product colors
    if (productColors && Array.isArray(productColors) && productColors.length > 0) {
      data.productColors = {
        create: productColors.map((e) => ({
          colorName: e.colorName,
          hexCode: e.hexCode,
        })),
      };
    }

    // Handle other optional fields
    if (material !== undefined) data.material = material;
    if (quantity !== undefined) data.quantity = Number(quantity);
    if (status !== undefined) data.status = status;
    if (discount !== undefined) data.discount = Number(discount);
    if (sku !== undefined) data.sku = sku;

    // Create the product
    const product = await prisma.product.create({
      data: data,
      include: {
        categories: true,
        productSizes: true,
        productImages: true,
        productColors: true,
      },
    });

    res.status(201).json({
      message: "Product created successfully",
      product: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
}
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    
    console.log('🔄 UPDATE - Original ID:', id);
    
    // Clean the ID - remove any surrounding quotes
    const cleanId = id.replace(/^"+|"+$/g, '');
    console.log('🔄 UPDATE - Cleaned ID:', cleanId);
    
    // First, get ALL products to find the exact match
    const allProducts = await prisma.product.findMany({
      select: { id: true, name: true }
    });
    
    // Find the exact product ID from database
    const productMatch = allProducts.find(p => {
      const dbId = p.id.replace(/^"+|"+$/g, '');
      return dbId === cleanId;
    });
    
    if (!productMatch) {
      console.log('❌ Product not found after cleaning ID');
      console.log('📋 Available IDs:', allProducts.map(p => p.id));
      return res.status(404).json({ 
        error: "Product not found",
        requestedId: id,
        cleanedId: cleanId,
        availableIds: allProducts.map(p => p.id)
      });
    }
    
    console.log('✅ Product found:', productMatch.name);
    
    // Use the EXACT ID from database for the query
    const exactId = productMatch.id;
    
    const existing = await prisma.product.findUnique({
      where: { 
        id: exactId
      },
      include: {
        productImages: true,
        productSizes: true,
        productColors: true,
        categories: true,
      },
    });

    if (!existing) {
      console.log('❌ Failed to find with exact ID - this should not happen');
      return res.status(404).json({ 
        error: "Product lookup failed with exact ID",
        exactId: exactId
      });
    }

    console.log('✅ Successfully retrieved product for update:', existing.name);

    const {
      name,
      description,
      price,
      material,
      quantity,
      status,
      discount,
      sku,
      categoryIds,
      productSizes,
      productColors,
      removedImageIds,
    } = req.body;

    let data = {};

    // Update base fields
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = parseFloat(price);
    if (material !== undefined) data.material = material;
    if (quantity !== undefined) data.quantity = parseInt(quantity);
    if (status !== undefined) data.status = status;
    if (discount !== undefined) data.discount = parseFloat(discount);
    if (sku !== undefined) data.sku = sku;

    // Handle arrays
    if (categoryIds) {
      try {
        const parsedCategoryIds = Array.isArray(categoryIds) ? categoryIds : JSON.parse(categoryIds);
        data.categories = {
          set: parsedCategoryIds.map((id) => ({ id })),
        };
      } catch (error) {
        return res.status(400).json({ error: "Invalid categoryIds format" });
      }
    }

    // Handle productColors
    if (productColors) {
      try {
        const parsedColors = Array.isArray(productColors) ? productColors : JSON.parse(productColors);
        
        // Delete existing colors
        await prisma.productColor.deleteMany({
          where: { productId: exactId }
        });

        // Create new colors
        if (parsedColors.length > 0) {
          data.productColors = {
            create: parsedColors.map((c, index) => ({
              colorName: c.colorName,
              hexCode: c.hexCode,
              displayOrder: index + 1
            })),
          };
        }
      } catch (error) {
        return res.status(400).json({ error: "Invalid productColors format" });
      }
    }

    // Handle productSizes
    if (productSizes) {
      try {
        const parsedSizes = Array.isArray(productSizes) ? productSizes : JSON.parse(productSizes);
        
        // Delete existing sizes
        await prisma.productSize.deleteMany({
          where: { productId: exactId }
        });

        // Create new sizes
        if (parsedSizes.length > 0) {
          data.productSizes = {
            create: parsedSizes.map((s, index) => ({
              size: parseInt(s.size),
              sizeSymbol: s.sizeSymbol,
              displayOrder: index + 1
            })),
          };
        }
      } catch (error) {
        return res.status(400).json({ error: "Invalid productSizes format" });
      }
    }

    // 🆕 AUTO-REPLACE IMAGES: Delete ALL old images if new ones are uploaded
    if (req.files && req.files.length > 0) {
      console.log('🔄 Auto-replacing old images with new ones');
      
      // Delete all existing images from Cloudinary
      if (existing.productImages && existing.productImages.length > 0) {
        console.log(`🗑️ Deleting ${existing.productImages.length} old images from Cloudinary`);
        for (const oldImage of existing.productImages) {
          try {
            await deleteImageFromCloudinary(oldImage.imageUrl);
            console.log(`✅ Deleted old image from Cloudinary: ${oldImage.id}`);
          } catch (cloudinaryError) {
            console.error(`❌ Failed to delete old image from Cloudinary: ${oldImage.id}`, cloudinaryError);
          }
        }
        
        // Delete all existing images from database
        await prisma.productImage.deleteMany({
          where: { productId: exactId }
        });
        console.log('✅ Cleared old images from database');
      }

      // Create new images
      const newImages = req.files.map((file, index) => ({
        imageUrl: file.path,
        altText: `${data.name || existing.name}-image-${index + 1}`,
        isPrimary: index === 0, // First image is primary
        displayOrder: index + 1,
      }));

      data.productImages = {
        create: newImages,
      };
      
      console.log(`📸 Added ${newImages.length} new images`);
    }
    // Handle specific image removals (if no new images but removedImageIds provided)
    else if (removedImageIds) {
      try {
        const parsedRemovedImages = Array.isArray(removedImageIds) ? removedImageIds : JSON.parse(removedImageIds);
        
        if (parsedRemovedImages.length > 0) {
          const imgsToDelete = existing.productImages.filter((img) =>
            parsedRemovedImages.includes(img.id)
          );

          // Delete from Cloudinary
          for (const img of imgsToDelete) {
            try {
              await deleteImageFromCloudinary(img.imageUrl);
              console.log(`✅ Deleted specific image from Cloudinary: ${img.id}`);
            } catch (cloudinaryError) {
              console.error(`❌ Failed to delete image from Cloudinary: ${img.id}`, cloudinaryError);
            }
          }

          // Delete from database
          await prisma.productImage.deleteMany({
            where: {
              id: { in: parsedRemovedImages },
              productId: exactId
            }
          });
          console.log(`✅ Deleted ${parsedRemovedImages.length} specific images from database`);
        }
      } catch (error) {
        return res.status(400).json({ error: "Invalid removedImageIds format" });
      }
    }

    // Perform the update
    const updatedProduct = await prisma.product.update({
      where: { id: exactId },
      data,
      include: {
        productImages: true,
        productSizes: true,
        productColors: true,
        categories: true,
      },
    });

    console.log('✅ Product updated successfully');

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (error) {
    console.error('💥 Update product error:', error);
    res.status(500).json({
      message: "Failed Updating Product",
      error: error.message
    });
  }
}
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    console.log('🗑️ DELETE - Original ID:', id);
    
    // Clean the ID
    const cleanId = id.replace(/^"+|"+$/g, '');
    
    // Find exact product ID from database
    const allProducts = await prisma.product.findMany({
      select: { id: true, name: true }
    });
    
    const productMatch = allProducts.find(p => {
      const dbId = p.id.replace(/^"+|"+$/g, '');
      return dbId === cleanId;
    });
    
    if (!productMatch) {
      return res.status(404).json({ 
        error: "Product not found",
        requestedId: id,
        cleanedId: cleanId
      });
    }
    
    const exactId = productMatch.id;
    
    // Get product with images using exact ID
    const product = await prisma.product.findUnique({
      where: { id: exactId },
      include: { productImages: true },
    });

    // Delete images from Cloudinary
    if (product.productImages && product.productImages.length > 0) {
      for (const image of product.productImages) {
        try {
          await deleteImageFromCloudinary(image.imageUrl);
        } catch (cloudinaryError) {
          console.error(`Failed to delete image: ${image.id}`, cloudinaryError);
        }
      }
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: exactId },
    });

    res.status(200).json({ 
      message: "Product Deleted Successfully"
    });
    
  } catch (error) {
    console.error('💥 Delete error:', error);
    res.status(500).json({ 
      message: "Failed Deleting Product", 
      error: error.message 
    });
  }
}
async function getUserProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [{ status: "ACTIVE" }, { status: "OUT_OF_STOCK" }],
      },
      orderBy: {
        updatedAt: "asc",
      },
    });
    
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No Products Found" });
    }
    
    return res.status(200).json({ 
      message: "You Get Products Successfully", 
      products: products 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Failed To Get Products", 
      error: error.message 
    });
  }
}
async function getAdminProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        updatedAt: "asc",
      },
    });
    
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No Products Found" });
    }
    
    return res.status(200).json({ 
      message: "You Get Products Successfully", 
      products: products 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Failed To Get Products", 
      error: error.message 
    });
  }
}
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst({
      where: {
        id: id
      },
      include: {
        productColors: true,
        productImages: true,
        productSizes: true
      }
    });

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    res.status(200).json({ 
      message: "You Get Product Successfully", 
      product: product 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed To Get Product", 
      error: error.message 
    });
  }
}

// Update individual product image
async function updateImageById(req, res) {
  try {
    const { id } = req.params;
    const { altText, isPrimary, displayOrder } = req.body;

    const image = await prisma.productImage.findUnique({
      where: { id },
      include: {
        product: {
          select: { userId: true }
        }
      }
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Authorization check
    if (image.product.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updateData = {};
    if (altText !== undefined) updateData.altText = altText;
    if (isPrimary !== undefined) updateData.isPrimary = isPrimary;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    // If setting as primary, unset others
    if (isPrimary === true) {
      await prisma.productImage.updateMany({
        where: { 
          productId: image.productId,
          id: { not: id }
        },
        data: { isPrimary: false }
      });
    }

    const updatedImage = await prisma.productImage.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({
      message: "Image updated successfully",
      image: updatedImage
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to update image",
      details: error.message
    });
  }
}

// Update individual product color
async function updateColorById(req, res) {
  try {
    const { id } = req.params;
    const { colorName, hexCode, displayOrder } = req.body;

    const color = await prisma.productColor.findUnique({
      where: { id },
      include: {
        product: {
          select: { userId: true }
        }
      }
    });

    if (!color) {
      return res.status(404).json({ error: "Color not found" });
    }

    if (color.product.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updateData = {};
    if (colorName !== undefined) updateData.colorName = colorName;
    if (hexCode !== undefined) updateData.hexCode = hexCode;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    const updatedColor = await prisma.productColor.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({
      message: "Color updated successfully",
      color: updatedColor
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to update color",
      details: error.message
    });
  }
}
// Delete product image by ID (with Cloudinary cleanup)
async function deleteImageById(req, res) {
  try {
    const { id } = req.params;

    // First get the image to extract Cloudinary URL
    const image = await prisma.productImage.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            userId: true
          }
        }
      }
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Optional: Check if user owns the product (security)
    if (image.product.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Not authorized to delete this image" });
    }

    // Delete from Cloudinary
    await deleteImageFromCloudinary(image.imageUrl);

    // Delete from database
    await prisma.productImage.delete({
      where: { id }
    });

    res.status(200).json({
      message: "Image deleted successfully",
      deletedImage: {
        id: image.id,
        imageUrl: image.imageUrl
      }
    });

  } catch (error) {
    console.error('Delete image error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Image not found" });
    }
    
    res.status(500).json({
      error: "Failed to delete image",
      details: error.message
    });
  }
}

// Delete product color by ID
async function deleteColorById(req, res) {
  try {
    const { id } = req.params;

    // First get the color to verify ownership
    const color = await prisma.productColor.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            userId: true
          }
        }
      }
    });

    if (!color) {
      return res.status(404).json({ error: "Color not found" });
    }

    // Optional: Check if user owns the product
    if (color.product.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Not authorized to delete this color" });
    }

    // Delete from database
    await prisma.productColor.delete({
      where: { id }
    });

    res.status(200).json({
      message: "Color deleted successfully",
      deletedColor: {
        id: color.id,
        colorName: color.colorName,
        hexCode: color.hexCode
      }
    });

  } catch (error) {
    console.error('Delete color error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Color not found" });
    }
    
    res.status(500).json({
      error: "Failed to delete color",
      details: error.message
    });
  }
}

// Delete product size by ID
async function deleteSizeById(req, res) {
  try {
    const { id } = req.params;

    // First get the size to verify ownership
    const size = await prisma.productSize.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            userId: true
          }
        }
      }
    });

    if (!size) {
      return res.status(404).json({ error: "Size not found" });
    }

    // Optional: Check if user owns the product
    if (size.product.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Not authorized to delete this size" });
    }

    // Delete from database
    await prisma.productSize.delete({
      where: { id }
    });

    res.status(200).json({
      message: "Size deleted successfully",
      deletedSize: {
        id: size.id,
        size: size.size,
        sizeSymbol: size.sizeSymbol
      }
    });

  } catch (error) {
    console.error('Delete size error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Size not found" });
    }
    
    res.status(500).json({
      error: "Failed to delete size",
      details: error.message
    });
  }
}
// Create a new product image for an existing product
async function createImageForProduct(req, res) {
  try {
    const { productId } = req.params;
    const { altText, isPrimary, displayOrder } = req.body;

    // Verify product exists and user has permission
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, userId: true }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Authorization check
    if (product.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Not authorized to add images to this product" });
    }

    // Get the uploaded file
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // If setting as primary, unset other primary images
    if (isPrimary === true) {
      await prisma.productImage.updateMany({
        where: { productId: productId },
        data: { isPrimary: false }
      });
    }

    // Get current image count for displayOrder
    const imageCount = await prisma.productImage.count({
      where: { productId: productId }
    });

    const newImage = await prisma.productImage.create({
      data: {
        imageUrl: imageFile.path,
        altText: altText || `${product.name}-image-${imageCount + 1}`,
        isPrimary: isPrimary || false,
        displayOrder: displayOrder || imageCount + 1,
        productId: productId
      }
    });

    res.status(201).json({
      message: "Image added to product successfully",
      image: newImage
    });

  } catch (error) {
    console.error('Create image error:', error);
    res.status(500).json({
      error: "Failed to add image to product",
      details: error.message
    });
  }
}

// Create a new product color for an existing product
async function createColorForProduct(req, res) {
  try {
    const { productId } = req.params;
    const { colorName, hexCode, displayOrder } = req.body;

    // Verify product exists and user has permission
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, userId: true }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Authorization check
    if (product.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Not authorized to add colors to this product" });
    }

    // Validate required fields
    if (!colorName || !hexCode) {
      return res.status(400).json({ error: "colorName and hexCode are required" });
    }

    // Get current color count for displayOrder
    const colorCount = await prisma.productColor.count({
      where: { productId: productId }
    });

    const newColor = await prisma.productColor.create({
      data: {
        colorName: colorName,
        hexCode: hexCode,
        displayOrder: displayOrder || colorCount + 1,
        productId: productId
      }
    });

    res.status(201).json({
      message: "Color added to product successfully",
      color: newColor
    });

  } catch (error) {
    console.error('Create color error:', error);
    res.status(500).json({
      error: "Failed to add color to product",
      details: error.message
    });
  }
}

// Create a new product size for an existing product
async function createSizeForProduct(req, res) {
  try {
    const { productId } = req.params;
    const { size, sizeSymbol, displayOrder } = req.body;

    // Verify product exists and user has permission
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, userId: true }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Authorization check
    if (product.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Not authorized to add sizes to this product" });
    }

    // Validate required fields
    if (!size || !sizeSymbol) {
      return res.status(400).json({ error: "size and sizeSymbol are required" });
    }

    // Get current size count for displayOrder
    const sizeCount = await prisma.productSize.count({
      where: { productId: productId }
    });

    const newSize = await prisma.productSize.create({
      data: {
        size: Number(size),
        sizeSymbol: sizeSymbol,
        displayOrder: displayOrder || sizeCount + 1,
        productId: productId
      }
    });

    res.status(201).json({
      message: "Size added to product successfully",
      size: newSize
    });

  } catch (error) {
    console.error('Create size error:', error);
    res.status(500).json({
      error: "Failed to add size to product",
      details: error.message
    });
  }
}
// Add these functions to your productController

const getPriceRange = async (req, res) => {
    try {
        const priceRange = await prisma.product.aggregate({
            where: {
                status: { in: ['ACTIVE', 'OUT_OF_STOCK'] }
            },
            _min: {
                price: true
            },
            _max: {
                price: true
            }
        })

        res.status(200).json({
            success: true,
            data: {
                min: priceRange._min.price || 0,
                max: priceRange._max.price || 1000
            }
        })
    } catch (error) {
        console.error('Price range error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to get price range',
            error: error.message
        })
    }
}

const searchProducts = async (req, res) => {
    try {
        const {
            query,
            category,
            minPrice,
            maxPrice,
            sortBy = 'name',
            sortOrder = 'asc',
            page = 1,
            limit = 12
        } = req.query

        // Build where clause for Prisma
        const where = {
            AND: [
                // Text search across name and description
                query ? {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ]
                } : {},
                
                // Category filter by category ID
                category ? { 
                    categories: { 
                        some: { id: category } 
                    } 
                } : {},
                
                // Only show active products
                { status: { in: ['ACTIVE', 'OUT_OF_STOCK'] } }
            ]
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit)

        // First, get all products that match the basic filters
        const allProducts = await prisma.product.findMany({
            where,
            include: {
                productImages: {
                    take: 1,
                    select: { imageUrl: true }
                },
                categories: {
                    select: { id: true, name: true }
                }
            }
        })

        // Calculate discounted prices and filter by price range
        const productsWithDiscountedPrice = allProducts.map(product => ({
            ...product,
            discountedPrice: product.price * (1 - product.discount)
        }))

        // Apply price range filter on discounted price
        let filteredProducts = productsWithDiscountedPrice;
        
        if (minPrice || maxPrice) {
            filteredProducts = productsWithDiscountedPrice.filter(product => {
                const finalPrice = product.discountedPrice;
                let passMin = true;
                let passMax = true;
                
                if (minPrice) passMin = finalPrice >= parseFloat(minPrice);
                if (maxPrice) passMax = finalPrice <= parseFloat(maxPrice);
                
                return passMin && passMax;
            });
        }

        // Apply sorting
        const sortedProducts = filteredProducts.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'price':
                    // Sort by discounted price
                    aValue = a.discountedPrice;
                    bValue = b.discountedPrice;
                    break;
                case 'createdAt':
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
                    break;
                case 'updatedAt':
                    aValue = new Date(a.updatedAt);
                    bValue = new Date(b.updatedAt);
                    break;
                case 'name':
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
            }
            
            if (sortOrder === 'desc') {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            } else {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            }
        });

        // Apply pagination
        const totalCount = sortedProducts.length;
        const totalPages = Math.ceil(totalCount / limit);
        const paginatedProducts = sortedProducts.slice(skip, skip + parseInt(limit));

        // Add discountedPrice to the response
        const finalProducts = paginatedProducts.map(product => ({
            ...product,
            discountedPrice: product.discountedPrice // Include in response
        }));

        res.status(200).json({
            success: true,
            message: 'Search completed successfully',
            data: {
                products: finalProducts,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalCount,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                },
                filters: {
                    query,
                    category,
                    minPrice,
                    maxPrice,
                    sortBy,
                    sortOrder
                }
            }
        })

    } catch (error) {
        console.error('Search error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to search products',
            error: error.message
        })
    }
}


module.exports = {
   searchProducts, // Add this
  getPriceRange,
  createProduct,
  updateProduct,
  deleteProduct,
  getUserProducts,
  getProductById,
  getAdminProducts,
  deleteImageById,
  deleteColorById,
  deleteSizeById,
  updateImageById,
  updateColorById,
  createImageForProduct,
createColorForProduct,
createSizeForProduct
};
