import jwt from "jsonwebtoken"
import config from "../config/config.js"
import { ApiError } from "./ApiError.js"

export const generateRefreshToken = (userId, email, username) => {
    return jwt.sign({ userId: userId.toString(), email, username }, config.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    })
}

export const generateAccessToken = (userId, email, username) => {
    return jwt.sign({ userId: userId.toString(), email, username }, config.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    })
}

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, config.REFRESH_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
}

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, config.ACCESS_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid access token or expired");
    }
}