import api from "../../../app/axios.api";

export async function fetchWorkspaces() {
  const response = await api.get("workspace/all");
  return response.data;
}