import { body, param, query, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((error) => error.msg);
    throw new ApiError(400, "Validation Error", extractedErrors);
  }
  next();
};

export const sendMessageValidator = [
  param("workspaceId")
    .trim()
    .notEmpty().withMessage("Workspace ID is required")
    .isMongoId().withMessage("Workspace ID is not a valid MongoDB ID"),

  body("content")
    .trim()
    .notEmpty().withMessage("Message content is required")
    .isString().withMessage("Message content must be a string")
    .isLength({ min: 1, max: 1000 }).withMessage("Message must be between 1 and 1000 characters"),

  validate,
];

export const getMessagesValidator = [
  param("workspaceId")
    .trim()
    .notEmpty().withMessage("Workspace ID is required")
    .isMongoId().withMessage("Workspace ID is not a valid MongoDB ID"),

  query("before")
    .optional()
    .isMongoId().withMessage("'before' cursor must be a valid MongoDB ID"),

  validate,
];
