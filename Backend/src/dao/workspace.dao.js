import Workspace from "../models/workspace.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createWorkspace = async (
  name,
  description,
  ownerId,
  inviteCode,
) => {
  try {
    const workspace = await Workspace.create({
      name,
      description,
      owner: ownerId,
      members: [ownerId],
      inviteCode,
    });

    return workspace;
  } catch (error) {
    throw new ApiError(500, "Error creating workspace");
  }
};

export const getAllWorkspaces = async (userId) => {
    const foundWorkspaces = await Workspace.find({
        $or: [
            { owner: userId },
            { members: userId }
        ]
    })
    .populate("owner", "username")
    .select("name description owner visibility inviteCode createdAt")
    .sort({ createdAt: -1 })
    .lean();
    return foundWorkspaces;
};

export const getWorkspaceById = async (workspaceId, userId) => {
    const workspace = await Workspace.findOne({
        _id: workspaceId,
        $or: [
            { owner: userId },
            { members: userId }
        ]
    })
    .populate("owner", "username email")
    .select("name description owner members visibility inviteCode createdAt")
    .lean();
    return workspace;
}

export const checkWorkSpaceMember = async (workspaceId, userId)=>{
  const exists = await Workspace.findOne({
    _id: workspaceId,
    $or: [{ owner: userId }, { members: userId }],
  }).lean();

  return exists;
}
