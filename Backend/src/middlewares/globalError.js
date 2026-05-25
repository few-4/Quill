import { ApiError } from "../utils/ApiError.js";

function globalError(err, req, res, next) {

    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors
        })
    } else {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Internal Server Error",
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
            errors: err.errors
        })
    }
}

export default globalError