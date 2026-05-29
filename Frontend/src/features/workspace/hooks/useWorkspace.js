import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchWorkspaces,
  createWorkspace as createWorkspaceApi,
  joinWorkspace as joinWorkspaceApi,
  deleteWorkspace as deleteWorkspaceApi,
} from "../services/workspace.api.js";
import { setCurrentWorkspace } from "../workspace.slice.js";

export const useWorkspaces = () => {
  const { accessToken } = useSelector((state) => state.auth);
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchWorkspaces,
    enabled: !!accessToken,
  });
};

export const useCreateWorkspace = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkspaceApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      dispatch(setCurrentWorkspace(data.data));
      navigate(`/dashboard/${data.data._id}`);
    },
  });
};

export const useJoinWorkspace = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinWorkspaceApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      dispatch(setCurrentWorkspace(data.data));
      navigate(`/dashboard/${data.data._id}`);
    },
  });
};

export const useDeleteWorkspace = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkspaceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      navigate("/workspace");
    },
  });
};

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
        dispatch(setCurrentWorkspace(data.data));
        navigate(`/dashboard/${data.data._id}`);
      },
      onError: (error) => {
        console.log(error.response?.data?.message || error.message);
      },
    });

  const handleJoinWorkspace = () =>
    useMutation({
      mutationFn: joinWorkspaceApi,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        dispatch(setCurrentWorkspace(data.data));
        navigate(`/dashboard/${data.data._id}`);
      },
      onError: (error) => {
        console.log(error.response?.data?.message || error.message);
      },
    });

  return { handleWorkspaces, handleCreateWorkspace, handleJoinWorkspace };
};
