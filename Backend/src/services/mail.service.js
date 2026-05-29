import nodemailer from "nodemailer";
import config from "../config/config.js";
import dns from "dns";

// Force Node to prioritize IPv4 over IPv6 when resolving hosts
// (fixes ENETUNREACH / connection errors on cloud hosts like Render which don't support IPv6)
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
}

export const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Quill" <${config.EMAIL_USER}>`,
        to: email,
        subject: "Verify your account - OTP",
        html: `
        <div style="background-color: #f9f9f9; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
    
            <div style="background-color: #4f46e5; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Quill</h1>
            </div>

            <div style="padding: 40px 30px; text-align: center;">
            <h2 style="font-size: 22px; margin-bottom: 20px; color: #1f2937;">Verify Your Account</h2>
            <p style="font-size: 16px; color: #4b5563; margin-bottom: 30px;">
                Thank you for joining <strong>Quill</strong>! Use the verification code below to complete your registration.
            </p>
      
            <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; display: inline-block; margin-bottom: 30px; border: 1px dashed #d1d5db;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; font-family: monospace;">${otp}</span>
            </div>

            <p style="font-size: 14px; color: #9ca3af; margin-top: 20px;">
                This code is valid for <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.
            </p>
            </div>

            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                &copy; ${new Date().getFullYear()} Quill App Inc. All rights reserved. <br>
                Rajasthan, India
                </p>
            </div>
            </div>
        </div>
        `
    };

        try {
            const info = await transporter.sendMail(mailOptions);
            return !!info.messageId;
        } catch (error) {
            console.error("[SMTP Error] Failed to send OTP email:", error.message || error);
            return false;
        }

    }

export const sendPasswordResetEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Quill" <${config.EMAIL_USER}>`,
        to: email,
        subject: "Reset your password - OTP",
        html: `
        <div style="background-color: #f9f9f9; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
    
            <div style="background-color: #4f46e5; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Quill</h1>
            </div>

            <div style="padding: 40px 30px; text-align: center;">
            <h2 style="font-size: 22px; margin-bottom: 20px; color: #1f2937;">Reset Your Password</h2>
            <p style="font-size: 16px; color: #4b5563; margin-bottom: 30px;">
                You requested to reset your password for <strong>Quill</strong>. Use the 6-digit recovery code below to proceed:
            </p>
      
            <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; display: inline-block; margin-bottom: 30px; border: 1px dashed #d1d5db;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; font-family: monospace;">${otp}</span>
            </div>

            <p style="font-size: 14px; color: #9ca3af; margin-top: 20px;">
                This code is valid for <strong>10 minutes</strong>. If you didn't request a password reset, you can safely ignore this email.
            </p>
            </div>

            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                &copy; ${new Date().getFullYear()} Quill App Inc. All rights reserved. <br>
                Rajasthan, India
                </p>
            </div>
            </div>
        </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return !!info.messageId;
    } catch (error) {
        console.error("[SMTP Error] Failed to send password reset email:", error.message || error);
        return false;
    }
}