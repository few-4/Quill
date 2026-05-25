import Document from "../models/document.model.js"

export const createDocument = async (title, type, workspaceId, authorId, content) => {
    const createdDoc = await Document.create({
        title: title?.trim() || "Untitled Document",
        type,
        workspaceId,
        authorId: authorId,
        content: content,
        collaborators: [authorId],
    })

    return createdDoc;
}

export const getWorkspaceDocuments = async (workspaceId) => {
  const documents = await Document.find({ workspaceId })
    .populate("authorId", "username email")
    .sort({ createdAt: -1 })
    .lean();

  return documents;
};

export const getDocumentfromDB = async(docId) => {

  const document = await Document.findById(docId).populate("authorId", "username email").lean();

  return document;
}

export const saveDocumentData = async(docId, content, yDocState) => {
  const document = await Document.findByIdAndUpdate(docId, { content, yDocState }, { new: true }).lean();

  return document;
}