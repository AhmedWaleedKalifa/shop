const { error } = require("console");
const prisma = require("../config/db");
const db = require("../config/db");

async function createCategory(req, res) {
  try {
    const userId = req.user.id;
    const { name, description, buttonText, displayOrder, imageUrl } = req.body;
    if (!name | !description | !buttonText | !displayOrder | !imageUrl) {
      res.status(400).json({ error: "You should fill all fields" });
    }
    const category = await prisma.category.create({
      data: {
        name,
        description,
        buttonText,
        displayOrder,
        imageUrl,
        userId,
      },
    });
    res
      .status(200)
      .json({ message: "Category Created Successfully", category: category });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed To Create Category", details: error.message });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await prisma.category.findMany(
      {
        orderBy: {
        displayOrder:"asc",
      },
      }
    );
    if (!categories || categories.length == 0) {
      res.status(404).json({ error: "No Category Found" });
    }
    res
      .status(200)
      .json({
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
    const category=await prisma.category.delete({
      where:{id}
    })
    if(!category){
      res.status(404).json({error:"Category Not Found"})
    }

    res.status(200).json({error:"Category Deleted Successfully",category:category})
  } catch (error) {
    res.status(500).json({error:"Failed To Delete Category"})
  }
}
async function updateCategory(req, res) {
  
}

module.exports = {
  createCategory,
  updateCategory,
  getCategories,
  deleteCategory,
};
