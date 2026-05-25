import { Router } from "express";
import { loginUser, logoutUser, registerUser, resendOtp, verifyOtp, refreshAccessToken, getCurrentUser } from "../controllers/auth.controller.js";
import { emailValidator, loginValidator, otpValidator, registerValidator } from "../validators/auth.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { tokenMiddleware } from "../middlewares/token.middleware.js";

const authRouter = Router();


// Auth Routes

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", registerValidator, registerUser);

/**
 * @route POST /api/auth/verify-otp
 * @desc Verify user OTP
 * @access Public
 */
authRouter.post("/verify-otp", otpValidator, verifyOtp);

/**
 * @route POST /api/auth/resend-otp
 * @desc Resend OTP to user
 * @access Public
 */
authRouter.post("/resend-otp", emailValidator, resendOtp);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
authRouter.post("/login", loginValidator, loginUser);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
authRouter.post("/logout", authMiddleware, logoutUser);

/**
 * @route POST /api/auth/refresh-token
 * @desc Refresh access token
 * @access Public
 */
authRouter.post("/refresh-token", tokenMiddleware, refreshAccessToken);

/**
 * @route GET /api/auth/get-me
 * @desc Get current user
 * @access Private
 */
authRouter.get("/get-me", authMiddleware, getCurrentUser);

export default authRouter;