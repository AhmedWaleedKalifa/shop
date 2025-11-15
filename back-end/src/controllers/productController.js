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
    } = req.body;

    let { productSizes, productColors, productImages, categoryIds } = req.body;

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
    //image handling

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

    if (categoryIds) {
      try {
        categoryIds = JSON.parse(categoryIds);
        if (!Array.isArray(categoryIds)) {
          return res
            .status(400)
            .json({ error: "categoryIds must be an array" });
        }
      } catch (e) {
        return res.status(400).json({
          error: "Invalid categoryIds JSON format",
          details: e.message,
        });
      }
    }
    if (productSizes) {
      try {
        productSizes = JSON.parse(productSizes);
        if (!Array.isArray(productSizes)) {
          return res
            .status(400)
            .json({ error: "productSizes must be an array" });
        }
      } catch (e) {
        return res.status(400).json({
          error: "Invalid productSizes JSON format",
          details: e.message,
        });
      }
    }
    if (productColors) {
      try {
        productColors = JSON.parse(productColors);
        if (!Array.isArray(productColors)) {
          return res
            .status(400)
            .json({ error: "productColors must be an array" });
        }
      } catch (e) {
        return res.status(400).json({
          error: "Invalid productColors JSON format",
          details: e.message,
        });
      }
    }

    if (categoryIds?.length > 0) {
      data.categories = {
        connect: categoryIds.map((id) => ({
          id,
        })),
      };
    }
    if (productSizes?.length > 0) {
      data.productSizes = {
        create: productSizes.map((e) => ({
          size: e.size,
          sizeSymbol: e.sizeSymbol,
        })),
      };
    }
    if (productColors?.length > 0) {
      data.productColors = {
        create: productColors.map((e) => ({
          colorName: e.colorName,
          hexCode: e.hexCode,
        })),
      };
    }

    // Handle other optional fields
    if (material !== undefined) {
      data.material = material;
    }
    if (quantity !== undefined) {
      data.quantity = Number(quantity);
    }
    if (status !== undefined) {
      data.status = status;
    }
    if (discount !== undefined) {
      data.discount = Number(discount);
    }
    if (sku !== undefined) {
      data.sku = sku;
    }


    const product = await prisma.product.create({
      data: data,
      include: {
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
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const available = await prisma.product.findUnique({
      where: { id },
      include: { productImages: true },
    });

    const imagesArray = available.productImages;
    for (let i = 0; i < imagesArray.length; i++) {
      deleteImageFromCloudinary(imagesArray[i].imageUrl);
    }
    const product = await prisma.product.delete({
      where: { id },
    });
    if (!product) {
      res.status(400).json({ error: "This Product Not Found" });
    }
    res
      .status(200)
      .json({ message: "Product Deleted Successfully", product: product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed Deleting Product", error: error.message });
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
    if (!products | (products.length == 0)) {
      res.status(404).json({ message: "No Products Found" });
    }
    res
      .status(200)
      .json({ message: "You Get Products Successfully", products: products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed To Get Products", error: error.message });
  }
}
async function getAdminProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        updatedAt: "asc",
      },
    });
    if (!products | (products.length == 0)) {
      res.status(404).json({ message: "No Products Found" });
    }
    res
      .status(200)
      .json({ message: "You Get Products Successfully", products: products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed To Get Products", error: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({
      where: { id },
      include: {
        productImages: true,
        productSizes: true,
        productColors: true,
        categories: true,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }

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
 

    // const imagesArray = existing.productImages;
    // for (let i = 0; i < imagesArray.length; i++) {
    //   deleteImageFromCloudinary(imagesArray[i].imageUrl);
    // }
    
    // Update base fields
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = Number(price);
    if (material !== undefined) data.material = material;
    if (quantity !== undefined) data.quantity = Number(quantity);
    if (status !== undefined) data.status = status;
    if (discount !== undefined) data.discount = Number(discount);
    if (sku !== undefined) data.sku = sku;

    // -----------------------------
    // Parse Arrays
    // -----------------------------
    let parsedCategoryIds = null;
    let parsedSizes = null;
    let parsedColors = null;
    let parsedRemovedImages = null;

    if (categoryIds) {
      try {
        parsedCategoryIds = JSON.parse(categoryIds);
        if (!Array.isArray(parsedCategoryIds))
          return res.status(400).json({ error: "categoryIds must be array" });

        data.categories = {
          set: [], // remove all previous
          connect: parsedCategoryIds.map((id) => ({ id })),
        };
      } catch (error) {
        return res.status(400).json({ error: "Invalid categoryIds JSON" });
      }
    }

    if (productSizes) {
      try {
        parsedSizes = JSON.parse(productSizes);
        if (!Array.isArray(parsedSizes))
          return res.status(400).json({ error: "productSizes must be array" });

        data.productSizes = {
          deleteMany: {}, // removes all previous sizes
          create: parsedSizes.map((s) => ({
            size: s.size,
            sizeSymbol: s.sizeSymbol,
          })),
        };
      } catch (error) {
        return res.status(400).json({ error: "Invalid productSizes JSON" });
      }
    }

    if (productColors) {
      try {
        parsedColors = JSON.parse(productColors);
        if (!Array.isArray(parsedColors))
          return res.status(400).json({ error: "productColors must be array" });

        data.productColors = {
          deleteMany: {},
          create: parsedColors.map((c) => ({
            colorName: c.colorName,
            hexCode: c.hexCode,
          })),
        };
      } catch (error) {
        return res.status(400).json({ error: "Invalid productColors JSON" });
      }
    }

    if (removedImageIds) {
      try {
        parsedRemovedImages = JSON.parse(removedImageIds);
        if (!Array.isArray(parsedRemovedImages))
          return res.status(400).json({ error: "removedImageIds must be array" });
      } catch (error) {
        return res.status(400).json({ error: "Invalid removedImageIds JSON" });
      }
    }

    // -----------------------------
    // Handle NEW uploaded images
    // -----------------------------
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        imageUrl: file.path,
        altText: `${existing.name || name}-image-${Date.now()}-${index}`,
        isPrimary: false,
        displayOrder: existing.productImages.length + index + 1,
      }));

      data.productImages = {
        create: newImages,
      };
    }

    // -----------------------------
    // Delete removed images from Cloudinary + Prisma
    // -----------------------------
    if (parsedRemovedImages?.length > 0) {
      const imgsToDelete = existing.productImages.filter((img) =>
        parsedRemovedImages.includes(img.id)
      );

      // Delete from cloud
      for (const img of imgsToDelete) {
        await deleteImageFromCloudinary(img.imageUrl);
      }

      data.productImages = {
        ...(data.productImages || {}),
        deleteMany: parsedRemovedImages.map((id) => ({ id })),
      };
    }

    // -----------------------------
    // UPDATE PRODUCT
    // -----------------------------
    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
      include: {
        productImages: true,
        productSizes: true,
        productColors: true,
        categories: true,
      },
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed Updating Product",
      error: error.message,
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
async function getFilteredProducts(req, res) {}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getFilteredProducts,
  getUserProducts,
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
