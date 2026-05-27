import { redirect } from "react-router";
import store from "../../../app/app.store";
import { fetchWorkspaces } from "../services/workspace.api";

export async function workspaceLoader() {
  const token = store.getState().auth.accessToken;
  
  try {
    const responseData = await fetchWorkspaces();
    return { workspaces: responseData?.data?.workspaces || [] };
  } catch (error) {
    console.error("Workspace loading error:", error);
    return { workspaces: [] };
  }
}