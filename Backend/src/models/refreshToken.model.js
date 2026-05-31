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

RefreshTokenSchema.pre("save", async function () {
    if (this.isModified("token")) {
        this.token = await hashPassword(this.token);
    }
});

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;