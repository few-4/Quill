import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"
import globalError from "../middlewares/globalError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import authRouter from "../routes/auth.routes.js";
import workspaceRouter from "../routes/workspace.route.js";
import documentRouter from "../routes/document.routes.js";
import messageRouter from "../routes/message.routes.js";
import http from "http"

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map(o => o.trim().replace(/\/$/, ""))
    : ["http://localhost:5173"];

const corsOptions = {
    origin: (origin, callback) => {
        const cleanOrigin = origin ? origin.replace(/\/$/, "") : "";
        if (!origin || cleanOrigin.endsWith(".vercel.app") || allowedOrigins.includes(cleanOrigin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));
app.use(morgan("dev"));

// Middleware for parsing JSON request bodies
app.use(express.json({ limit: "16kb" }));

// Middleware for parsing URL-encoded request bodies
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware for serving static files
app.use(express.static("public"));

// Middleware for parsing cookies
app.use(cookieParser());


// Health check route
app.get("/health", (req, res) => {
    const response = new ApiResponse(200, { message: "Hello World!" }, "Server is running")
    response.send(res)
});

//Routes

//Auth
app.use("/api/auth", authRouter)

//Notes route
app.use("/api/workspace", workspaceRouter)

//Document route
app.use("/api/document", documentRouter)

app.use("/api/message", messageRouter)


// Global error handling middleware
app.use(globalError)

export { app, server };