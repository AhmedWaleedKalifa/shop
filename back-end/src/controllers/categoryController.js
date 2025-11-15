const prisma = require("../config/prisma");
const deleteImageFromCloudinary=require("../middleware/deleteFromCloudinary")
async function createCategory(req, res) {
  try {
    const userId = req.user.id;
    let { name, description, buttonText, displayOrder, productIds } = req.body;

    const imageUrl = req.file?.path;

    if (!name || !description || !buttonText || !displayOrder) {
      return res.status(400).json({ error: "You should fill all fields" });
    }

    if (productIds) {
      try {
        productIds = JSON.parse(productIds); // productIds must be ["id1","id2"]
      } catch (e) {
        return res.status(400).json({ error: "Invalid productIds JSON format" });
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        buttonText,
        displayOrder: Number(displayOrder),
        imageUrl,
        userId,

        products: productIds?.length
          ? {
              connect: productIds.map((id) => ({ id })),
            }
          : undefined,
      },

      include: {
        products: true, 
      },
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

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
        const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ error: "Category Not Found" });
    }

    const imageUrlToDelete = category.imageUrl;

    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    if (imageUrlToDelete) {
      await deleteImageFromCloudinary(imageUrlToDelete);
    }

    return res.status(200).json({ 
      message: "Category Deleted Successfully", 
      category: deletedCategory 
    });
  } catch (error) {
    console.error("Delete category error:", error);
    return res.status(500).json({ 
      error: "Failed To Delete Category",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description, buttonText, displayOrder } = req.body;
    const imageUrl = req.file?.path;
    const updateData = {};
    if (name != undefined) {
      updateData.name = name;
    }
    if (description != undefined) {
      updateData.description = description;
    }
    if (buttonText != undefined) {
      updateData.buttonText = buttonText;
    }
    if (displayOrder != undefined) {
      updateData.displayOrder = Number();
    }
    if (imageUrl != undefined) {
      updateData.imageUrl = imageUrl;
    }
    if (Object.keys(updateData).length == 0) {
      res.status(400).json({ message: "There Is No Data To Update" });
    }
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        buttonText: true,
        displayOrder: true,
        imageUrl: true,
      },
    });
    res.status(200).json({
      message: "Category Updated Successfully",
      category: updatedCategory,
    });
  } catch (error) {}
}

module.exports = {
  createCategory,
  updateCategory,
  getCategories,
  deleteCategory,
};
