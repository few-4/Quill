import { Router } from "express";
import { createWorkspace, getAllWorkspaces, getSingleWorkspace, joinWorkspace, updateWorkspace, deleteWorkspace } from "../controllers/workspace.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createWorkspaceValidator, updateWorkspaceValidator } from "../validators/workspace.validator.js";

const workspaceRouter = Router();

/**
 * @description create workspace
 * @route POST /api/workspace/create
 * @access Private
 */
workspaceRouter.post("/create", authMiddleware, createWorkspaceValidator, createWorkspace);

/**
 * @description get all workspaces
 * @route GET /api/workspace
 * @access Private
 */
workspaceRouter.get("/all", authMiddleware, getAllWorkspaces)

/**
 * @description join workspace using invite code
 * @route POST /api/workspace/join
 * @access Private
 */
workspaceRouter.post("/join", authMiddleware, joinWorkspace);

/**
 * @description get single workspace
 * @route GET /api/workspace/:workspaceId
 * @access Private
 */
workspaceRouter.get("/:workspaceId", authMiddleware, getSingleWorkspace)

/**
 * @description update workspace
 * @route PATCH /api/workspace/:workspaceId
 * @access Private
 */
workspaceRouter.patch("/:workspaceId", authMiddleware, updateWorkspaceValidator, updateWorkspace);

/**
 * @description delete workspace (owner only)
 * @route DELETE /api/workspace/:workspaceId
 * @access Private
 */
workspaceRouter.delete("/:workspaceId", authMiddleware, deleteWorkspace);

export default workspaceRouter;