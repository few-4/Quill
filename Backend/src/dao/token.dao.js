import RefreshToken from "../models/refreshToken.model.js";
import { ApiError } from "../utils/ApiError.js";

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
        const refreshToken = await RefreshToken.findOne({ token });
        return refreshToken;
    } catch (error) {
        throw new ApiError(500, "Error finding refresh token");
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