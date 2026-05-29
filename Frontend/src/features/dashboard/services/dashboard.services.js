import api from "../../../app/axios.api.js"

export async function fetchDocuments(workspaceId) {
  const response = await api.get(`document/workspace/${workspaceId}`);
  return response.data;
}

export async function fetchDocumentById(docId) {
  const response = await api.get(`document/${docId}`);
  return response.data;
}

export async function createDocument({ title, type, workspaceId, textContent }) {
  const response = await api.post("document/create", { title, type, workspaceId, textContent });
  return response.data;
}

export async function renameDocument({ docId, title }) {
  const response = await api.patch(`document/${docId}`, { title });
  return response.data;
}

export async function deleteDocument({ docId }) {
  const response = await api.delete(`document/${docId}`);
  return response.data;
}