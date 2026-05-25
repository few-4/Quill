import { Router } from "express";
import { createWorkspace, getAllWorkspaces, getSingleWorkspace } from "../controllers/workspace.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createWorkspaceValidator } from "../validators/workspace.validator.js";

const workspace = Router();

/**
 * @description create workspace
 * @route POST /api/workspace/create
 * @access Private
 */
workspace.post("/create", authMiddleware, createWorkspaceValidator, createWorkspace);

/**
 * @description get all workspaces
 * @route GET /api/workspace
 * @access Private
 */
workspace.get("/all", authMiddleware, getAllWorkspaces)

/**
 * @description get single workspace
 * @route GET /api/workspace/:workspaceId
 * @access Private
 */
workspace.get("/:workspaceId", authMiddleware, getSingleWorkspace)

export default workspace;