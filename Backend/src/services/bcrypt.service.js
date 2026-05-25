import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";

export const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
    } catch (error) {
        throw new ApiError(500, "Error hashing password");
    }
}

export const comparePassword = async (password, hashedPassword) => {
    try {
        if (!hashedPassword) {
            throw new Error("Hashed password is required for comparison");
        }
        const comparedPassword = await bcrypt.compare(password, hashedPassword);
        return comparedPassword;
    } catch (error) {
        throw new ApiError(500, error.message || "Error comparing password");
    }
}
