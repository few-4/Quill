import dotenv from "dotenv";

dotenv.config();

const isProduction =
  process.env.NODE_ENV === "production" ||
  (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN.startsWith("https"));

export const CookieOption = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

const input = [
  { name: "PORT", value: process.env.PORT },
  { name: "MONGO_URI", value: process.env.MONGO_URI },
  { name: "ACCESS_TOKEN_SECRET", value: process.env.ACCESS_TOKEN_SECRET },
  { name: "REFRESH_TOKEN_SECRET", value: process.env.REFRESH_TOKEN_SECRET },
];

input.map(({ name, value }) => {
  if (!value) {
    console.error(`[Config] Missing required environment variable: ${name}`);
    process.exit(1);
  }
});

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};

export default config;
