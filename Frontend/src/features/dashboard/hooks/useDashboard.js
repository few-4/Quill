import { useDispatch } from "react-redux";
import { fetchCurrentWorkspace } from "../../workspace/services/workspace.api";
import { setWorkspace } from "../dashboard.slice";

export const useDashboard = () => {
  const dispatch = useDispatch();

  const handleCurrentWorkspace = async (workspaceId) => {
    try {
      const response = await fetchCurrentWorkspace(workspaceId);
      dispatch(setWorkspace(response.data.workspace));
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleCurrentWorkspace,
  };
};
