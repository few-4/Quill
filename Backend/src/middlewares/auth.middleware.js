import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/token.util.js";

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader && authHeader.split(" ")[1]; 

        if(!accessToken) {
            throw new ApiError(401, "Unauthorized: Access token missing");
        }

        const decodedToken = verifyAccessToken(accessToken);

        if(!decodedToken) {
            throw new ApiError(401, "Unauthorized: Invalid access token");
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        next(error);
    }
}