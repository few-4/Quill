import Document from "../models/document.model.js"

export const createDocument = async (title, type, workspaceId, authorId, textContent = null) => {
    const createdDoc = await Document.create({
        title: title?.trim() || "Untitled Document",
        type,
        workspaceId,
        authorId: authorId,
        textContent: textContent,
        visualContent: [],
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

export const saveDocumentData = async(docId, textContent, visualContent, yDocState, type) => {
  const updateFields = {};
  if (textContent !== undefined) updateFields.textContent = textContent;
  if (visualContent !== undefined) updateFields.visualContent = visualContent;
  if (yDocState !== undefined) updateFields.yDocState = yDocState;
  if (type !== undefined) updateFields.type = type;

  const document = await Document.findByIdAndUpdate(docId, updateFields, { returnDocument: 'after' }).lean();

  return document;
}

export const renameDocument = async (docId, title) => {
  const document = await Document.findByIdAndUpdate(
    docId,
    { $set: { title: title.trim() } },
    { returnDocument: 'after' }
  ).lean();

  return document;
}

export const deleteDocument = async (docId) => {
  const document = await Document.findByIdAndDelete(docId).lean();
  return document;
}