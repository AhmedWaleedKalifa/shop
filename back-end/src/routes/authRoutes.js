const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const authRouter = express.Router();

authRouter.post('/login',  authController.login);

module.exports = authRouter;