import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const findUserbyUsernameOrEmail = async (username, email) => {
    try {
        const user = await User.findOne({ $or: [{ username }, { email }] })
        return user;
    } catch (error) {
        throw new ApiError(500, "Error finding user");
    }
}

export const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        throw new ApiError(500, "Error finding user by email");
    }
}

export const findUserByUsername = async (username) => {
    try {
        const user = await User.findOne({ username });
        return user;
    } catch (error) {
        throw new ApiError(500, "Error finding user by username");
    }
}

export const findUserForLogin = async (email) => {
    try {
        const user = await User.findOne({ email }).select("+password");
        return user;
    } catch (error) {
        throw new ApiError(500, "Error finding user for login");
    }
}

export const createUser = async (username, email, password, fullname, otp, otpExpiry) => {
    try {
        const user = await User.create({ username, email, password, fullname, otp, otpExpiry })
        return user;
    } catch (error) {
        throw new ApiError(500, "Error creating user");
    }
}

export const deleteUser = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        return user;
    } catch (error) {
        throw new ApiError(500, "Error deleting user");
    }
}

export const updateUserVerification = async (userId) => {
    try {
        const user = await User.findByIdAndUpdate(userId, {
            $set: { isVerified: true },
            $unset: { otp: 1, otpExpiry: 1 }
        }, { returnDocument: 'after' });
        return user;
    } catch (error) {
        throw new ApiError(500, "Error updating user verification");
    }
}

export const updateUserOtp = async (userId, otp, otpExpiry) => {
    try {
        const user = await User.findByIdAndUpdate(userId, {
            $set: { otp, otpExpiry }
        }, { returnDocument: 'after' });
        return user;
    } catch (error) {
        throw new ApiError(500, "Error updating user OTP");
    }
}

export const findUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        throw new ApiError(500, "Error finding user by ID");
    }
}