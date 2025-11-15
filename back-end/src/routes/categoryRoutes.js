const express = require("express");
const categoryController = require("../controllers/categoryController");
const { authenticate, authorize } = require("../middleware/auth");
const upload=require( "../middleware/uploadCategory");

const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  upload.single("imageUrl"),
  categoryController.createCategory
);
categoryRouter.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  upload.single("imageUrl"),
  categoryController.updateCategory
);
categoryRouter.get(
  "/",
  categoryController.getCategories
);
categoryRouter.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  categoryController.deleteCategory
);

module.exports = categoryRouter;

