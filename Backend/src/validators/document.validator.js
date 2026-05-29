import { body, validationResult, param } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map((error) => error.msg);
        throw new ApiError(400, "Validation Error", extractedErrors);
    }

    next();
}

export const createDocumentValidator = [
    body("title")
        .trim()
        .optional()
        .isString().withMessage("Document title must be a string")
        .isLength({ min: 3, max: 30 }).withMessage("Document title must be between 3 and 30 characters long"),

    body("type")
        .trim()
        .toLowerCase()
        .notEmpty().withMessage("Document type is required")
        .isString().withMessage("Document type must be a string")
        .custom((value) => {
            const allowedTypes = ["text", "visual"];
            if (!allowedTypes.includes(value)) {
                throw new Error("Invalid document type. Only 'text' or 'excalidraw' are allowed.");
            }
            return true;
        }),
    
    body("workspaceId")
        .trim()
        .notEmpty().withMessage("Workspace ID is required")
        .isString().withMessage("Workspace ID must be a string")
        .isMongoId().withMessage("Workspace ID is not a valid mongo ID"),

    validate
]

export const getWorkspaceDocumentsValidator = [
    param("workspaceId")
        .trim()
        .notEmpty().withMessage("Workspace ID path parameter is required")
        .isMongoId().withMessage("The provided Workspace ID is not a valid MongoDB ID"),
        
    validate
];

export const getDocumentByIdValidator = [
    param("docId")
        .trim()
        .notEmpty().withMessage("Document ID is required")
        .isString().withMessage("Document ID must be a string")
        .isMongoId().withMessage("Document ID is not a valid mongo ID"),

    validate
]

export const renameDocumentValidator = [
    param("docId")
        .trim()
        .notEmpty().withMessage("Document ID is required")
        .isMongoId().withMessage("Document ID is not a valid mongo ID"),

    body("title")
        .trim()
        .notEmpty().withMessage("Document title is required")
        .isString().withMessage("Document title must be a string")
        .isLength({ min: 1, max: 60 }).withMessage("Document title must be between 1 and 60 characters"),

    validate
]

export const deleteDocumentValidator = [
    param("docId")
        .trim()
        .notEmpty().withMessage("Document ID is required")
        .isMongoId().withMessage("Document ID is not a valid mongo ID"),

    validate
]