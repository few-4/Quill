import { ApiError } from "../utils/ApiError.js";
import * as User from "../dao/user.dao.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { comparePassword, hashPassword } from "../services/bcrypt.service.js";
import { sendOTPEmail, sendPasswordResetEmail } from "../services/mail.service.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.util.js";
import { CookieOption } from "../config/config.js";
import { UAParser } from "ua-parser-js";
import { deleteRefreshToken, saveRefreshToken, findRefreshToken, findRefreshTokenById } from "../dao/token.dao.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, fullname } = req.body;

    console.log(req.body, "in controller")
    const userByEmail = await User.findUserByEmail(email);
    if (userByEmail) {
        if (userByEmail.isVerified) {
            throw new ApiError(409, "User with this email already exists, please login");
        } else {
            await User.deleteUser(userByEmail._id);
        }
    }

    const userByUsername = await User.findUserByUsername(username);
    if (userByUsername) {
        if (userByUsername.isVerified) {
            throw new ApiError(409, "Username is already taken");
        } else {
            await User.deleteUser(userByUsername._id);
        }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const emailSent = await sendOTPEmail(email, otp)

    if (!emailSent) {
        throw new ApiError(500, "Failed to send OTP email. Please try again.");
    }

    const hashedPassword = await hashPassword(password)

    const createdUser = await User.createUser(username, email, hashedPassword, fullname, otp, otpExpiry)

    return new ApiResponse(201, { email: createdUser.email }, "OTP sent to your email").send(res);
})

export const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findUserByEmail(email);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.otp) {
        throw new ApiError(400, "User is already verified. Please login");
    }

    if (user.otp !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (user.otpExpiry < new Date()) {
        throw new ApiError(400, "OTP has expired, please generate new one.");
    }

    const updatedUser = await User.updateUserVerification(user._id);

    const refreshToken = await generateRefreshToken(updatedUser._id, updatedUser.email, updatedUser.username);
    const accessToken = await generateAccessToken(updatedUser._id, updatedUser.email, updatedUser.username);

    const ua = new UAParser(req.headers['user-agent']).getResult();
    const deviceInfo = `${ua.browser.name || "Unknown Browser"} on ${ua.os.name || "Unknown OS"} ${ua.os.version || ""}`.trim();

    const storedRefreshToken = await saveRefreshToken(updatedUser._id, refreshToken, deviceInfo);

    res.cookie("refreshToken", refreshToken, { ...CookieOption, maxAge: 60 * 60 * 24 * 7 * 1000 }); // 7 days

    const userResponse = updatedUser.toObject ? updatedUser.toObject() : { ...updatedUser };
    delete userResponse.password;
    delete userResponse.otp;
    delete userResponse.otpExpiry;

    return new ApiResponse(200, {
        user: userResponse,
        token: accessToken,
    }, "User verified successfully").send(res);
})

export const resendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findUserByEmail(email);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "User is already verified. Please login");
    }

    if (user.otp && user.otpExpiry > new Date()) {
        throw new ApiError(400, "OTP is already sent, please wait for 10 minutes");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const emailSent = await sendOTPEmail(email, otp)
    
    if (!emailSent) {
        throw new ApiError(500, "Failed to send OTP email. Please try again.");
    }

    const updatedUser = await User.updateUserOtp(user._id, otp, otpExpiry);

    return new ApiResponse(200, { email: updatedUser.email }, "OTP sent to your email").send(res);
})

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findUserForLogin(email);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.isVerified) {
        throw new ApiError(400, "User is not verified. Please verify your email by registering again.");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const isTokenExist = await findRefreshTokenById(user._id)

    if (isTokenExist) {
        const revokeAccess = await deleteRefreshToken(user._id);

        if (!revokeAccess) {
            console.warn(`Logout warning: No active tokens found or deleted for user: ${user._id}`);
        }
    }

    const refreshToken = await generateRefreshToken(user._id, user.email, user.username);
    const accessToken = await generateAccessToken(user._id, user.email, user.username);

    const ua = new UAParser(req.headers['user-agent']).getResult();
    const deviceInfo = `${ua.browser.name || "Unknown Browser"} on ${ua.os.name || "Unknown OS"} ${ua.os.version || ""}`.trim();

    const storedRefreshToken = await saveRefreshToken(user._id, refreshToken, deviceInfo);

    res.cookie("refreshToken", refreshToken, { ...CookieOption, maxAge: 60 * 60 * 24 * 7 * 1000 }); // 7 days

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.otp;
    delete userResponse.otpExpiry;

    return new ApiResponse(200, {
        user: userResponse,
        token: accessToken,
    }, "User logged in successfully").send(res);
})

export const logoutUser = asyncHandler(async (req, res) => {
    const { userId } = req.user;

    const revokeAccess = await deleteRefreshToken(userId);

    if (!revokeAccess) {
        console.warn(`Logout warning: No active tokens found or deleted for user: ${userId}`);
    }

    res.clearCookie("refreshToken", CookieOption);
    return new ApiResponse(200, {}, "User logged out successfully").send(res);
})

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    const decodedToken = await verifyRefreshToken(incomingRefreshToken);

    const user = await User.findUserByEmail(decodedToken.email);
    if (!user) {
        throw new ApiError(401, "Unauthorized: Invalid refresh token");
    }

    const tokenInDb = await findRefreshToken(incomingRefreshToken);
    if (!tokenInDb) {
        throw new ApiError(401, "Unauthorized: Refresh token expired or used");
    }

    const accessToken = await generateAccessToken(user._id, user.email, user.username);

    return new ApiResponse(200, {
        token: accessToken
    }, "Access token refreshed successfully").send(res);
})

export const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findUserById(req.user.userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return new ApiResponse(200, { userId: user._id, email: user.email, username: user.username, fullname: user.fullname }, "User fetched successfully").send(res);
})

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findUserByEmail(email);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.isVerified) {
        throw new ApiError(400, "User is not verified");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.updateUserForgotPasswordOtp(user._id, otp, otpExpiry);

    const emailSent = await sendPasswordResetEmail(email, otp);
    if (!emailSent) {
        throw new ApiError(500, "Failed to send reset OTP email");
    }

    return new ApiResponse(200, { email }, "Password reset OTP sent to your email").send(res);
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, password } = req.body;

    const user = await User.findUserByEmail(email);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.forgotPasswordOtp) {
        throw new ApiError(400, "No password reset requested");
    }

    if (user.forgotPasswordOtp !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (user.forgotPasswordOtpExpiry < new Date()) {
        throw new ApiError(400, "OTP has expired");
    }

    const hashedPassword = await hashPassword(password);
    await User.updateUserPassword(user._id, hashedPassword);

    await deleteRefreshToken(user._id);

    return new ApiResponse(200, {}, "Password reset successfully").send(res);
});