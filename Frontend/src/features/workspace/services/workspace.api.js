import api from "../../../app/axios.api";

export async function fetchWorkspaces() {
  const response = await api.get("workspace/all");
  return response.data;
}

export async function createWorkspace({ name, description }) {
  const response = await api.post("workspace/create", { name, description });
  return response.data;
}

export async function fetchCurrentWorkspace(id){
  const response = await api.get(`workspace/${id}`)
  return response.data;
}