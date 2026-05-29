import { checkWorkSpaceMember } from "../dao/workspace.dao.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as DocumentDAO from "../dao/document.dao.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createDocument = asyncHandler(async (req, res)=>{

    const {title, type, workspaceId, textContent} = req.body;
    const userId = req.user.userId;

  const isWorkspaceMember = await checkWorkSpaceMember(workspaceId, userId);

  if(!isWorkspaceMember){
    throw new ApiError(403, "You do not have permission to create documents in this workspace");
  }

  const createdDoc = await DocumentDAO.createDocument(
    title,
    type,
    workspaceId,
    userId,
    textContent ?? null
  )

  return new ApiResponse(201, createdDoc, "Document created successfully").send(res);
})

export const getWorkspaceDocuments = asyncHandler(async (req, res)=>{

  const { workspaceId } = req.params;
  const userId = req.user.userId;

  const isMember = await checkWorkSpaceMember(workspaceId, userId);
  if(!isMember){
    throw new ApiError(403, "You do not have permission to access this workspace");
  }

  const foundDocuments = await DocumentDAO.getWorkspaceDocuments(workspaceId);

  return new ApiResponse(200, foundDocuments, "Documents fetched successfully").send(res);
})

export const getDocument = asyncHandler(async (req, res)=>{

  const { docId } = req.params;
  const userId = req.user.userId;

  const foundDocument = await DocumentDAO.getDocumentfromDB(docId);
  if(!foundDocument){
    throw new ApiError(404, "Document not found");
  }

  const isMember = await checkWorkSpaceMember(foundDocument.workspaceId, userId);
  if(!isMember){
    throw new ApiError(403, "You do not have permission to access this document");
  }

  return new ApiResponse(200, foundDocument, "Document fetched successfully").send(res);
})

export const renameDocument = asyncHandler(async (req, res) => {
  const { docId } = req.params;
  const { title } = req.body;
  const userId = req.user.userId;

  const foundDocument = await DocumentDAO.getDocumentfromDB(docId);
  if (!foundDocument) {
    throw new ApiError(404, "Document not found");
  }

  const isMember = await checkWorkSpaceMember(foundDocument.workspaceId, userId);
  if (!isMember) {
    throw new ApiError(403, "You do not have permission to rename this document");
  }

  const updatedDocument = await DocumentDAO.renameDocument(docId, title);

  return new ApiResponse(200, updatedDocument, "Document renamed successfully").send(res);
})

export const deleteDocument = asyncHandler(async (req, res) => {
  const { docId } = req.params;
  const userId = req.user.userId;

  const foundDocument = await DocumentDAO.getDocumentfromDB(docId);
  if (!foundDocument) {
    throw new ApiError(404, "Document not found");
  }

  const isMember = await checkWorkSpaceMember(foundDocument.workspaceId, userId);
  if (!isMember) {
    throw new ApiError(403, "You do not have permission to delete this document");
  }

  await DocumentDAO.deleteDocument(docId);

  return new ApiResponse(200, { docId }, "Document deleted successfully").send(res);
})