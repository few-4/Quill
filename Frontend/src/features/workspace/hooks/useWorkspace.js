import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchWorkspaces,
  createWorkspace as createWorkspaceApi,
} from "../services/workspace.api.js";
import { getMe } from "../../auth/services/auth.api.js";
import { setCurrentWorkspace } from "../workspace.slice.js";

export const useWorkspace = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { accessToken } = useSelector((state) => state.auth);

  const handleWorkspaces = () =>
    useQuery({
      queryKey: ["workspaces"],
      queryFn: fetchWorkspaces,
      enabled: !!accessToken,
    });

  const handleCreateWorkspace = () =>
    useMutation({
      mutationFn: createWorkspaceApi,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        dispatch(setCurrentWorkspace(data.data))
        navigate(`/dashboard/${data.data._id}`)
      },
      onError: (error) => {
        console.log(error.response.data.message)
      }
    });

  return { handleWorkspaces, handleCreateWorkspace };
};
