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

export const createUser = async (username, email, password, fullname) => {
    try {
        const user = await User.create({ username, email, password, fullname, isVerified: true })
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

export const findUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        throw new ApiError(500, "Error finding user by ID");
    }
}

export const updateUserPassword = async (userId, password) => {
    try {
        const user = await User.findByIdAndUpdate(userId, {
            $set: { password }
        }, { returnDocument: "after" });
        return user;
    } catch (error) {
        throw new ApiError(500, "Error updating user password");
    }
}