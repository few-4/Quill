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
