import RefreshToken from "../models/refreshToken.model.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const saveRefreshToken = async (userId, token, deviceInfo) => {
    try {
        const refreshToken = await RefreshToken.create({ userId, token, deviceInfo });
        return refreshToken;
    } catch (error) {
        throw new ApiError(500, "Error saving refresh token");
    }
}

export const deleteRefreshToken = async (userId) => {
    try {
        const deletedToken = await RefreshToken.deleteMany({ userId }); 
        return deletedToken.deletedCount > 0;
    } catch (error) {
        throw new ApiError(500, "Error deleting refresh token");
    }
}

export const findRefreshToken = async (token) => {
    try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.userId) {
            return null;
        }
        const userTokens = await RefreshToken.find({ userId: decoded.userId });
        for (const dbRecord of userTokens) {
            const isMatch = await bcrypt.compare(token, dbRecord.token);
            if (isMatch) {
                return dbRecord;
            }
        }
        return null;
    } catch (error) {
        throw new ApiError(500, "Error finding and verifying refresh token");
    }
}

export const findRefreshTokenById = async (userId) => {
    try {
        const refreshToken = await RefreshToken.findOne({ userId });
        return refreshToken;
    } catch (error) {
        throw new ApiError(500, "Error finding refresh token");
    }
}