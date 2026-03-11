const express = require('express');
const authRouter = express.Router();

const authController = require("../controllers/auth.controller")


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register",authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post("/login",authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @desc clear token from user cookies and add token to blacklist
 * @access Public
 */
authRouter.get("/logout",authController.logoutUserController)

module.exports = authRouter;