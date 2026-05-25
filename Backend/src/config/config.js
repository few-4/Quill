import dotenv from "dotenv";

dotenv.config();

export const CookieOption = {
        httpOnly: true,  // Prevents JS access (XSS protection)
        secure: false,
        sameSite: "lax", // Prevents CSRF attacks
    }

const input = [
    { name: "PORT", value: process.env.PORT },
    { name: "MONGO_URI", value: process.env.MONGO_URI },
    { name: "EMAIL_USER", value: process.env.EMAIL_USER },
    { name: "EMAIL_PASS", value: process.env.EMAIL_PASS },
    { name: "ACCESS_TOKEN_SECRET", value: process.env.ACCESS_TOKEN_SECRET },
    { name: "REFRESH_TOKEN_SECRET", value: process.env.REFRESH_TOKEN_SECRET }
]

input.map(({name, value}) => {
    if (!value) {
        console.log(`${name} is not defined`);
        process.exit(1);
    }
})


const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET
}

export default config;