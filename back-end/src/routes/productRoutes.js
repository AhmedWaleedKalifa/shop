const express = require("express");
const productController = require("../controllers/productController");
const productRouter = express.Router();


productRouter.post("/", productController.createProduct);
productRouter.put("/", productController.updateProduct);
productRouter.get("/", productController.getFilteredProducts);
productRouter.delete("/", productController.deleteProduct);

module.exports = productRouter;