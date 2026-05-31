import mongoose from "mongoose";
import { hashPassword } from "../services/bcrypt.service.js";

const RefreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    deviceInfo: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d'
    }
});

RefreshTokenSchema.pre("save", async function (next) {
    if (this.isModified("token")) {
        try {
            this.token = await hashPassword(this.token);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;