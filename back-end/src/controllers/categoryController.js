const prisma = require("../config/prisma");
const deleteImageFromCloudinary = require("../middleware/deleteFromCloudinary");
async function createCategory(req, res) {
  try {
    const userId = req.user.id;
    let { name, description, buttonText, displayOrder, productIds } = req.body;

    const imageUrl = req.file?.path;

    if (!name || !description) {
      return res.status(400).json({
        error: "You should fill name and description",
      });
    }

    if (productIds) {
      try {
        productIds = JSON.parse(productIds); // example: ["id1","id2"]
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
    if (imageUrl) {
      data.imageUrl = imageUrl;
    }

    // Products relation
    if (productIds?.length > 0) {
      data.products = {
        connect: productIds.map((id) => ({ id })),
      };
    }

    // Create category
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
      category: deletedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed To Delete Category",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description, buttonText, displayOrder } = req.body;
    let productIds = req.body.productIds; // ✅ Change to let
    const imageUrl = req.file?.path;
    
    const updateData = {};
    const old=await prisma.category.findUnique({
      where:{
        id
      }
    })
    const image=old.imageUrl;
    if(image){
      deleteImageFromCloudinary(image);
    }
    if (productIds) {
      try {
        productIds = JSON.parse(productIds); // ✅ Now this works
        if (!Array.isArray(productIds)) {
          return res.status(400).json({ error: "productIds must be an array" });
        }
      } catch (e) {
        return res.status(400).json({
          error: "Invalid productIds JSON format",
        });
      }
    }

    // Products relation
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
    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
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
};
