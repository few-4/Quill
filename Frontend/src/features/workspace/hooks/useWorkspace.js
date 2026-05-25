import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchWorkspaces } from "../services/workspace.api";

export const useWorkspace = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { accessToken } = useSelector((state) => state.auth);

  const workspacesQuery = useQuery({
    queryKey: ["workspaces"], // queryKey is REQUIRED in TanStack Query v5+
    queryFn: fetchWorkspaces,
    enabled: !!accessToken, 
  });

  console.log(workspacesQuery)

  return {
    dispatch,
    navigate,
    accessToken,
    workspaces: workspacesQuery.data?.data?.workspaces || [], // Extract nested array from API response envelope
    isLoading: workspacesQuery.isLoading,
    isError: workspacesQuery.isError,
    error: workspacesQuery.error,
    refetch: workspacesQuery.refetch,
  };
};