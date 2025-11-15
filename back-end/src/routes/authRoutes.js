const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const authRouter = express.Router();

authRouter.post('/login',  authController.login);
authRouter.post('/register', authController.register);
authRouter.get('/logout',  authController.logout);

module.exports = authRouter;