const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login',  authController.login);
authRouter.get('/logout',authenticate, authController.logout);

module.exports = authRouter;