import { ApiError } from "../utils/ApiError.js";
import * as User from "../dao/user.dao.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { comparePassword, hashPassword } from "../services/bcrypt.service.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.util.js";
import { CookieOption } from "../config/config.js";
import { UAParser } from "ua-parser-js";
import { deleteRefreshToken, saveRefreshToken, findRefreshToken, findRefreshTokenById } from "../dao/token.dao.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const userByEmail = await User.findUserByEmail(email);
    if (userByEmail) {
        throw new ApiError(409, "User with this email already exists, please login");
    }

    const usernameBase = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    let username = usernameBase;
    if (username.length < 3) {
        username = "user";
    }
    if (username.length > 10) {
        username = username.slice(0, 10);
    }
    username = username + Math.floor(100 + Math.random() * 900);

    const fullname = email.split("@")[0];

    const hashedPassword = await hashPassword(password)

    const createdUser = await User.createUser(username, email, hashedPassword, fullname)

    const refreshToken = await generateRefreshToken(createdUser._id, createdUser.email, createdUser.username);
    const accessToken = await generateAccessToken(createdUser._id, createdUser.email, createdUser.username);

    const ua = new UAParser(req.headers['user-agent']).getResult();
    const deviceInfo = `${ua.browser.name || "Unknown Browser"} on ${ua.os.name || "Unknown OS"} ${ua.os.version || ""}`.trim();

    await saveRefreshToken(createdUser._id, refreshToken, deviceInfo);

    res.cookie("refreshToken", refreshToken, { ...CookieOption, maxAge: 60 * 60 * 24 * 7 * 1000 });

    const userResponse = createdUser.toObject ? createdUser.toObject() : { ...createdUser };
    delete userResponse.password;
    delete userResponse.otp;
    delete userResponse.otpExpiry;

    return new ApiResponse(201, {
        user: userResponse,
        token: accessToken,
    }, "User registered successfully").send(res);
})

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findUserForLogin(email);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const isTokenExist = await findRefreshTokenById(user._id)

    if (isTokenExist) {
        const revokeAccess = await deleteRefreshToken(user._id);

        if (!revokeAccess) {
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
