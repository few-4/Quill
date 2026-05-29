import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { checkWorkSpaceMember } from "../dao/workspace.dao.js";
import * as MessageDAO from "../dao/message.dao.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  const isMember = await checkWorkSpaceMember(workspaceId, userId);
  if (!isMember) {
    throw new ApiError(403, "You do not have permission to send messages in this workspace");
  }

  const message = await MessageDAO.createMessage(workspaceId, userId, content.trim());

  return new ApiResponse(201, message, "Message sent successfully").send(res);
});

export const getMessages = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { before } = req.query;
  const userId = req.user.userId;

  const isMember = await checkWorkSpaceMember(workspaceId, userId);
  if (!isMember) {
    throw new ApiError(403, "You do not have permission to view messages in this workspace");
  }

  const messages = await MessageDAO.getMessagesByWorkspace(workspaceId, 50, before || null);

  return new ApiResponse(200, messages, "Messages fetched successfully").send(res);
});
