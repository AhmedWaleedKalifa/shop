const express = require("express");
const categoryController = require("../controllers/categoryController");
const { authenticate, authorize } = require("../middleware/auth");

const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  categoryController.createCategory
);
categoryRouter.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  categoryController.updateCategory
);
categoryRouter.get(
  "/",
  authenticate,
  authorize("ADMIN", "MODERATOR","USER"),
  categoryController.getCategories
);
categoryRouter.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  categoryController.deleteCategory
);

module.exports = categoryRouter;

