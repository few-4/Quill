import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createDocumentValidator, getDocumentByIdValidator, getWorkspaceDocumentsValidator } from "../validators/document.validator.js";
import { createDocument, getDocument, getWorkspaceDocuments } from "../controllers/document.controller.js";

const documentRouter = Router();

/**
 * @description create document
 * @route POST /api/document/create
 * @access Private
 */
documentRouter.post("/create", authMiddleware, createDocumentValidator, createDocument);

/**
 * @description get all documents of a workspace
 * @route GET /api/document/workspace/:workspaceId
 * @access Private
 */
documentRouter.get("/workspace/:workspaceId", authMiddleware, getWorkspaceDocumentsValidator, getWorkspaceDocuments)

/**
 * @description get document by id
 * @route GET /api/document/:docId
 * @access Private
 */
documentRouter.get("/:docId", authMiddleware, getDocumentByIdValidator, getDocument);


export default documentRouter