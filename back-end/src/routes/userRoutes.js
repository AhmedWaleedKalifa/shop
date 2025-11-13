const express = require("express");
const userController = require("../controllers/userController");
const authController = require('../controllers/authController');
const userRouter = express.Router();
const { authenticate,authorize } = require('../middleware/auth');


userRouter.post('/create',authenticate,authorize("ADMIN"), authController.register);
userRouter.put("/", userController.updateUser);
userRouter.get("/", userController.getUsers);
userRouter.delete("/", userController.deleteUser);

module.exports = userRouter;