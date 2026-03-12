const express = require('express');
const authRouter = express.Router();

const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

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

/**
 * @route POST /api/auth/getMe
 * @desc Get current logged in user details
 * @access Private
 */
authRouter.get("/getMe", authMiddleware.authUser, authController.getMeController)

module.exports = authRouter;