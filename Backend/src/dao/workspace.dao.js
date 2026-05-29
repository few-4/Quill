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

export const joinWorkspaceByInviteCode = async (inviteCode, userId) => {
  const workspace = await Workspace.findOne({ inviteCode });

  if (!workspace) {
    throw new ApiError(404, "Invalid invite code or workspace not found");
  }

  const isAlreadyMember = workspace.members.some(
    (memberId) => memberId.toString() === userId.toString()
  ) || workspace.owner.toString() === userId.toString();

  if (isAlreadyMember) {
    return workspace;
  }

  workspace.members.push(userId);
  await workspace.save();

  const populatedWorkspace = await Workspace.findById(workspace._id)
    .populate("owner", "username email")
    .select("name description owner members visibility inviteCode createdAt")
    .lean();

  return populatedWorkspace;
};

export const updateWorkspace = async (workspaceId, ownerId, fields) => {
  const workspace = await Workspace.findOneAndUpdate(
    { _id: workspaceId, owner: ownerId },
    { $set: fields },
    { returnDocument: 'after' }
  )
  .populate("owner", "username email")
  .select("name description owner members visibility inviteCode createdAt");

  return workspace;
};

export const deleteWorkspace = async (workspaceId, ownerId) => {
  const workspace = await Workspace.findOneAndDelete({
    _id: workspaceId,
    owner: ownerId,
  }).lean();

  return workspace;
};

export const leaveWorkspace = async (workspaceId, userId) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) return null;

  if (workspace.owner.toString() === userId.toString()) {
    throw new ApiError(400, "As the workspace owner, you cannot leave the workspace. You must delete the workspace instead.");
  }

  workspace.members = workspace.members.filter(
    (memberId) => memberId.toString() !== userId.toString()
  );
  await workspace.save();
  return workspace;
};
