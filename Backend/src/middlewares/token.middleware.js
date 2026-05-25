import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/token.util.js";
import { ApiError } from "../utils/ApiError.js";

export const tokenMiddleware = asyncHandler(async (req, res, next) => {
  const incomingAccessToken = req.headers.authorization?.split(" ")[1];
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized: Refresh token missing");
  }

  if (!incomingAccessToken) {
    throw new ApiError(401, "Unauthorized: Access token missing");
  }

  try {
    const checkAccessToken = verifyAccessToken(incomingAccessToken);

    if (checkAccessToken) {
      return new ApiResponse(
        400,
        { token: incomingAccessToken },
        "Token is not expired",
      ).send(res);
    }
  } catch (error) {
    // Access token is expired or invalid, proceed to refresh
  }

  next();
});
