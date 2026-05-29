import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map((error) => error.msg);
        throw new ApiError(400, "Validation Error", extractedErrors);
    }

    next();
}

export const createWorkspaceValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Workspace name is required")
        .isString().withMessage("Workspace name must be a string")
        .isLength({ min: 3, max: 30 }).withMessage("Workspace name must be between 3 and 30 characters long"),

    body("description")
        .trim()
        .notEmpty().withMessage("Workspace description is required")
        .isString().withMessage("Workspace description must be a string")
        .isLength({ min: 10, max: 100 }).withMessage("Workspace description must be between 10 and 100 characters long"),

    validate
]

export const updateWorkspaceValidator = [
    body("name")
        .optional()
        .trim()
        .isString().withMessage("Workspace name must be a string")
        .isLength({ min: 3, max: 30 }).withMessage("Workspace name must be between 3 and 30 characters long"),

    body("description")
        .optional()
        .trim()
        .isString().withMessage("Workspace description must be a string")
        .isLength({ min: 10, max: 100 }).withMessage("Workspace description must be between 10 and 100 characters long"),

    body()
        .custom((_, { req }) => {
            if (!req.body.name && !req.body.description) {
                throw new Error("At least one of name or description is required");
            }
            return true;
        }),

    validate
]