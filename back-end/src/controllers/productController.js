const prisma = require("../config/prisma");
// id          String        @id @default(uuid())
//   category    Category[]
//   name        String
//   description String
//   material    String?
//   price       Float
//   quantity    Int
//   factory     String?
//   status      ProductStatus @default(INACTIVE)
//   discount    Float?
//   sku         String?
//   createdBy   User          @relation(fields: [userId], references: [id])
//   userId      String
//   createdAt   DateTime      @default(now())
//   updatedAt   DateTime      @updatedAt

// ProductColor
//   colorName String
//   hexCode   String
//   displayOrder

// ProductSize
//   size       Int
//   sizeSymbol String
//   displayOrder

// ProductImage
//   imageUrl  String
//   altText   String
//   isPrimary Boolean
//   displayOrder

//fix create products 
async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      material,
      price,
      quantity,
      status,
      discount,
      sku,
    } = req.body;
        const userId = req.user.id;

    if (!name || !description || !price ) {
      return res.status(400).json({ error: "You should fill name description and price fields" });
    }
    const product=await prisma.product.create({
      data:{
        name,
        price,
        description,
        userId
      }
    })
    res.status(200).json({message:"You made product successfully",product:product})
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed Creating Product", error: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const {id}=req.params
    const product=await prisma.product.delete({
      where:{id}
    })
    if(!product){
      res.status(400).json({error:"This Product Not Found"})
    }
    res.status(200).json({message:"Product Deleted Successfully", product:product})
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed Deleting Product", error: error.message });
  }
}
async function getProducts(req,res) {
   try {
    const products=await prisma.product.findMany();
    if(!products){
      res.status(404).json({error:"No Products Found"})
    }
    res.status(200).json({message:"You Get Products Successfully",products:products})
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed To Get Products", error: error.message });
  }
}


async function updateProduct(req, res) {
  try {
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed Updating Product", error: error.message });
  }
}


async function getFilteredProducts(req, res) {}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getFilteredProducts,
  getProducts,
};
