const express = require("express");
const productController = require("../controllers/productController");
const productRouter = express.Router();
const upload=require("../middleware/uploadProduct")
const {authenticate,authorize}=require("../middleware/auth")
// uploadProduct.array("images", 5),

productRouter.post("/",authenticate,authorize("ADMIN"),upload.array("images",5), productController.createProduct);
productRouter.put("/:id",authenticate,authorize("ADMIN"),upload.array("images",5), productController.updateProduct);
productRouter.get("/", productController.getProducts);
productRouter.delete("/:id",authenticate,authorize("ADMIN"), productController.deleteProduct);

module.exports = productRouter;
