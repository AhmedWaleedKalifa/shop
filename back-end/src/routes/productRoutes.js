const express = require("express");
const productController = require("../controllers/productController");
const productRouter = express.Router();
const upload=require("../middleware/uploadProduct")
const {authenticate,authorize}=require("../middleware/auth")
// uploadProduct.array("images", 5),
const { searchValidationRules, validateSearch } = require('../validators/searchValidator')

productRouter.post("/",authenticate,authorize("ADMIN"),upload.array("productImages",10), productController.createProduct);
productRouter.put("/:id",authenticate,authorize("ADMIN"),upload.array("productImages",10), productController.updateProduct);
productRouter.get("/admin",authenticate,authorize("ADMIN","MODERATOR"), productController.getAdminProducts);
productRouter.get("/", productController.getUserProducts);
productRouter.get('/search', searchValidationRules(), validateSearch, productController.searchProducts);
productRouter.get('/price-range', productController.getPriceRange);
productRouter.get("/:id", productController.getProductById);
productRouter.delete("/:id",authenticate,authorize("ADMIN"), productController.deleteProduct);

// // Individual CREATE operations
// productRouter.post("/:productId/images", authenticate, authorize("ADMIN"), upload.single("image"), productController.createImageForProduct);
// productRouter.post("/:productId/colors", authenticate, authorize("ADMIN"), productController.                        createColorForProduct);
// productRouter.post("/:productId/sizes", authenticate, authorize("ADMIN"), productController.                         createSizeForProduct);
// // Individual operations
// productRouter.delete("/images/:id", authenticate, authorize("ADMIN"), productController.deleteImageById);
// productRouter.delete("/colors/:id", authenticate, authorize("ADMIN"), productController.deleteColorById);
// productRouter.delete("/sizes/:id", authenticate, authorize("ADMIN"), productController. deleteSizeById);
// productRouter.patch("/images/:id", authenticate, authorize("ADMIN"), productController. updateImageById);
// productRouter.patch("/colors/:id", authenticate, authorize("ADMIN"), productController. updateColorById);

module.exports = productRouter;
