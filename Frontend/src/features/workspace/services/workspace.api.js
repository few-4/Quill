import api from "../../../app/axios.api";

export async function fetchWorkspaces() {
  const response = await api.get("workspace/all");
  return response.data;
}

export async function createWorkspace({ name, description }) {
  const response = await api.post("workspace/create", { name, description });
  return response.data;
}

export async function joinWorkspace({ inviteCode }) {
  const response = await api.post("workspace/join", { inviteCode });
  return response.data;
}

export async function fetchCurrentWorkspace(id){
  const response = await api.get(`workspace/${id}`)
  return response.data;
}

export async function updateWorkspace({ workspaceId, name, description }) {
  const response = await api.patch(`workspace/${workspaceId}`, { name, description });
  return response.data;
}

export async function deleteWorkspace({ workspaceId }) {
  const response = await api.delete(`workspace/${workspaceId}`);
  return response.data;
}

export async function leaveWorkspace({ workspaceId }) {
  const response = await api.post(`workspace/${workspaceId}/leave`);
  return response.data;
}