const express = require("express");
const userController = require("../controllers/userController");
const authController = require('../controllers/authController');
const userRouter = express.Router();
const { authenticate,authorize } = require('../middleware/auth');


userRouter.get("/",authenticate,authorize("ADMIN","MODERATOR"), userController.getUsers);
userRouter.get("/:id",authenticate,authorize("ADMIN"), userController.getUserById);
userRouter.post('/',authenticate,authorize("ADMIN"), authController.register);
userRouter.put("/:id",authenticate,authorize("ADMIN"), userController.updateUser);
userRouter.delete("/:id",authenticate,authorize("ADMIN"), userController.deleteUser);

module.exports = userRouter;