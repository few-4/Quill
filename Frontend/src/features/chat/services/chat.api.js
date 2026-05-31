import api from "../../../app/axios.api";

export async function fetchMessages(workspaceId, before = null) {
  const params = before ? { before } : {};
  const response = await api.get(`message/${workspaceId}`, { params });
  return response.data;
}

export async function postMessage({ workspaceId, content }) {
  const response = await api.post(`message/${workspaceId}`, { content });
  return response.data;
}

export async function putEditMessage({ messageId, content }) {
  const response = await api.put(`message/${messageId}`, { content });
  return response.data;
}

export async function deleteMessage(messageId) {
  const response = await api.delete(`message/${messageId}`);
  return response.data;
}
