import { asyncHandler } from "../utils/asyncHandler.js";
import { nanoid } from "nanoid"
import * as workspaceDao from "../dao/workspace.dao.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Document from "../models/document.model.js";

export const createWorkspace = asyncHandler(async(req,res)=>{

        const {name, description} = req.body;

        if(!name){
            throw new ApiError(400, "Workspace name is required")
        }

        const inviteCode = nanoid(10);
        
        const createWorkspace = await workspaceDao.createWorkspace(name, description, req.user.userId, inviteCode);

        return new ApiResponse(201, createWorkspace, "Workspace created successfully").send(res);
})

export const getAllWorkspaces = asyncHandler(async(req, res)=>{

    const workspaces = await workspaceDao.getAllWorkspaces(req.user.userId);

    return new ApiResponse(200, workspaces, "Workspaces fetched successfully").send(res);
})

export const getSingleWorkspace = asyncHandler(async (req, res) => {
    const workspaceId = req.params.workspaceId;

    const workspace = await workspaceDao.getWorkspaceById(workspaceId, req.user.userId);

    if(!workspace){
        throw new ApiError(404, "Workspace not found, please create one")
    }

    return new ApiResponse(200, {workspace}, "Workspace fetched successfully").send(res);
})

export const joinWorkspace = asyncHandler(async (req, res) => {
    const { inviteCode } = req.body;
    const userId = req.user.userId;

    if (!inviteCode) {
        throw new ApiError(400, "Invite code is required");
    }

    const workspace = await workspaceDao.joinWorkspaceByInviteCode(inviteCode?.trim(), userId);

    return new ApiResponse(200, workspace, "Successfully joined workspace").send(res);
});

export const updateWorkspace = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const userId = req.user.userId;
    const { name, description } = req.body;

    const fields = {};
    if (name) fields.name = name.trim();
    if (description) fields.description = description.trim();

    const workspace = await workspaceDao.updateWorkspace(workspaceId, userId, fields);

    if (!workspace) {
        throw new ApiError(403, "You do not have permission to update this workspace or it does not exist");
    }

    return new ApiResponse(200, workspace, "Workspace updated successfully").send(res);
});

export const deleteWorkspace = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const userId = req.user.userId;

    const deleted = await workspaceDao.deleteWorkspace(workspaceId, userId);

    if (!deleted) {
        throw new ApiError(403, "You do not have permission to delete this workspace or it does not exist");
    }

    await Document.deleteMany({ workspaceId });

    return new ApiResponse(200, { workspaceId }, "Workspace deleted successfully").send(res);
});