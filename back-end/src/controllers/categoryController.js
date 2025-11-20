const prisma = require("../config/prisma");
const deleteImageFromCloudinary = require("../middleware/deleteFromCloudinary");

async function createCategory(req, res) {
  try {
    const userId = req.user.id;
    let { name, description, buttonText, displayOrder, productIds } = req.body;

    const leftImage = req.files?.leftImage?.[0]?.path;
    const rightImage = req.files?.rightImage?.[0]?.path;

    if (!name || !description) {
      return res.status(400).json({
        error: "You should fill name and description",
      });
    }

    if (productIds) {
      try {
        productIds = JSON.parse(productIds);
        if (!Array.isArray(productIds))
          return res.status(400).json({ error: "productIds must be an array" });
      } catch (e) {
        return res.status(400).json({
          error: "Invalid productIds JSON format",
        });
      }
    }

    const data = {
      name,
      description,
      userId,
    };

    if (buttonText !== undefined) {
      data.buttonText = buttonText;
    }

    if (displayOrder !== undefined) {
      data.displayOrder = Number(displayOrder);
    }

    if (leftImage) {
      data.leftImage = leftImage;
    }

    if (rightImage) {
      data.rightImage = rightImage;
    }

    if (productIds?.length > 0) {
      data.products = {
        connect: productIds.map((id) => ({ id })),
      };
    }

    const category = await prisma.category.create({
      data,
      include: { products: true },
    });

    return res.status(200).json({
      message: "Category Created Successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed To Create Category",
      details: error.message,
    });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });
    if (!categories || categories.length == 0) {
      res.status(404).json({ error: "No Category Found" });
    }
    res.status(200).json({
      message: "You Get Categories Successfully",
      categories: categories,
    });
  } catch (error) {
    res.status(500).json({ error: "You Fail To Get Categories" });
  }
}

async function getCategoryById(req,res){
  try{
    const {id}=req.params
    const category =await prisma.category.findUnique({
      where:{
        id:id
      }
    })
    if (!category ) {
      res.status(404).json({ error: "Category Not found" });
    }
    res.status(200).json({
      message: "You Get Category Successfully",
      category: category,
    });
  }catch(error){
    res.status(500).json({ error: "You Fail To Get Categories" });
  }
}
async function getCategoryProducts(req, res) {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: {
        id: id
      },
      include: {
        products: {
          where: {
            OR: [
              { status: "ACTIVE" },
              { status: "OUT_OF_STOCK" }
            ]
          },
          select: {
            name: true,
            description: true,
            price: true,
            discount: true,
            id: true,
            status: true, // Include status to verify filtering
            productImages: {
              take: 1,
              select: {
                imageUrl: true
              }
            }
          }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (!category.products || category.products.length === 0) {
      return res.status(404).json({ error: "No active products found in this category" });
    }

    res.status(200).json({
      message: "You Get Category Products Successfully",
      products: category.products,
    });
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).json({ error: "You Fail To Get Categories Products" });
  }
}
async function getCategoryById(req,res){
  try{
    const {id}=req.params
    const category =await prisma.category.findUnique({
      where:{
        id:id
      }
    })
    if (!category ) {
      res.status(404).json({ error: "Category Not found" });
    }
    res.status(200).json({
      message: "You Get Category Successfully",
      category: category,
    });
  }catch(error){
    res.status(500).json({ error: "You Fail To Get Categories" });
  }
}
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ error: "Category Not Found" });
    }

    const imagesToDelete = [category.leftImage, category.rightImage].filter(Boolean);
    
    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    if (imagesToDelete.length > 0) {
      await Promise.all(imagesToDelete.map(image => deleteImageFromCloudinary(image)));
    }

    return res.status(200).json({
      message: "Category Deleted Successfully",
      category: deletedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed To Delete Category",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description, buttonText, displayOrder } = req.body;
    let productIds = req.body.productIds;
    const leftImage = req.files?.leftImage?.[0]?.path;
    const rightImage = req.files?.rightImage?.[0]?.path;

    const updateData = {};
    
    const oldCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!oldCategory) {
      return res.status(404).json({ error: "Category Not Found" });
    }

    if (productIds) {
      try {
        productIds = JSON.parse(productIds);
        if (!Array.isArray(productIds)) {
          return res.status(400).json({ error: "productIds must be an array" });
        }
      } catch (e) {
        return res.status(400).json({
          error: "Invalid productIds JSON format",
        });
      }
    }

    if (productIds?.length > 0) {
      updateData.products = {
        connect: productIds.map((id) => ({ id })),
      };
    }

    if (name !== undefined) {
      updateData.name = name;
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (buttonText !== undefined) {
      updateData.buttonText = buttonText;
    }
    if (displayOrder !== undefined) {
      updateData.displayOrder = Number(displayOrder);
    }

    if (leftImage !== undefined) {
      if (oldCategory.leftImage && !oldCategory.leftImage.includes("default")) {
        await deleteImageFromCloudinary(oldCategory.leftImage);
      }
      updateData.leftImage = leftImage;
    }

    if (rightImage !== undefined) {
      if (oldCategory.rightImage && !oldCategory.rightImage.includes("default")) {
        await deleteImageFromCloudinary(oldCategory.rightImage);
      }
      updateData.rightImage = rightImage;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "There Is No Data To Update" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
      include: { 
        products: true,
      },
    });

    res.status(200).json({
      message: "Category Updated Successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed To Update Category", 
      message: error.message 
    });
  }
}

module.exports = {
  createCategory,
  updateCategory,
  getCategories,
  deleteCategory,
  getCategoryById,
  getCategoryProducts
};