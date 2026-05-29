import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
        trim: true
    },
    fullname: {
        type: String,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: String,
    otpExpiry: Date,
    forgotPasswordOtp: String,
    forgotPasswordOtpExpiry: Date
}, { timestamps: true });

userSchema.index({ createdAt: 1 }, { 
  expireAfterSeconds: 600, 
  partialFilterExpression: { isVerified: false } 
});

const User = mongoose.model("User", userSchema);

export default User;