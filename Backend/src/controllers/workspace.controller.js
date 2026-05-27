import { asyncHandler } from "../utils/asyncHandler.js";
import { nanoid } from "nanoid"
import * as workspaceDao from "../dao/workspace.dao.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

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