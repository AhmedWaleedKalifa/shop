const express = require("express");
const categoryController = require("../controllers/categoryController");
const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../middleware/uploadCategory");

const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  upload.fields([
    { name: "leftImage", maxCount: 1 },
    { name: "rightImage", maxCount: 1 }
  ]),
  categoryController.createCategory
);

categoryRouter.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  upload.fields([
    { name: "leftImage", maxCount: 1 },
    { name: "rightImage", maxCount: 1 }
  ]),
  categoryController.updateCategory
);

categoryRouter.get(
  "/",
  categoryController.getCategories
);
categoryRouter.get(
  "/:id",
  categoryController.getCategoryById
);
categoryRouter.get(
  "/:id/products",
  categoryController.getCategoryProducts
);
categoryRouter.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  categoryController.deleteCategory
);

module.exports = categoryRouter;