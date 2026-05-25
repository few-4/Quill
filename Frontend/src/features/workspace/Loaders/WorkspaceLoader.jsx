import { redirect } from "react-router";
import store from "../../../app/app.store";
import { fetchWorkspaces } from "../services/workspace.api";
import { getMe } from "../../auth/services/auth.api";
import { setUser } from "../../auth/auth.slice";

export async function workspaceLoader() {
  const token = store.getState().auth.accessToken;

  if (!token) {
    return redirect("/sign-in");
  }

  // Pre-fetch user details and dispatch to Redux store to restore session details on reload
  try {
    const userResponse = await getMe();
    // The backend ApiResponse wraps payload in .data ({ userId, email, username, fullname })
    const userData = userResponse?.data;
    if (userData) {
      store.dispatch(
        setUser({
          id: userData.userId,
          email: userData.email,
          username: userData.username,
          fullname: userData.fullname,
        })
      );
    }
  } catch (error) {
    console.error("Workspace loader failed to fetch user profile:", error);
    // If token is invalid or request fails, force redirect to sign-in
    return redirect("/sign-in");
  }

  // Fetch workspaces
  try {
    const responseData = await fetchWorkspaces();
    return { workspaces: responseData?.data?.workspaces || [] };
  } catch (error) {
    console.error("Workspace loading error:", error);
    return { workspaces: [] };
  }
}