import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { fetchCurrentWorkspace } from "../../workspace/services/workspace.api";
import { setWorkspace } from "../dashboard.slice";
import { fetchDocuments, fetchDocumentById, createDocument as createDocumentApi, deleteDocument as deleteDocumentApi, renameDocument as renameDocumentApi } from "../services/dashboard.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCurrentWorkspace = (workspaceId) => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ["currentWorkspace", workspaceId],
    queryFn: async () => {
      const response = await fetchCurrentWorkspace(workspaceId);
      dispatch(setWorkspace(response.data.workspace));
      return response.data.workspace;
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDocuments = (workspaceId) =>
  useQuery({
    queryKey: ["documents", workspaceId],
    queryFn: () => fetchDocuments(workspaceId),
    enabled: !!workspaceId,
    staleTime: 0,
  });

export const useDocument = (documentId) =>
  useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      const res = await fetchDocumentById(documentId);
      return res.data;
    },
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000,
  });

export const useCreateDocument = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDocumentApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents", variables.workspaceId] });
      navigate(`/documents/${variables.workspaceId}/document/${data.data._id}`);
    },
  });
};

export const useDeleteDocument = (workspaceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocumentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", workspaceId] });
    },
  });
};

export const useRenameDocument = (workspaceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: renameDocumentApi,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["document", variables.docId], (old) =>
        old ? { ...old, title: data.data.title } : old
      );
      queryClient.setQueryData(["documents", workspaceId], (oldList) => {
        if (!oldList) return oldList;
        const docs = oldList?.data;
        if (!Array.isArray(docs)) return oldList;
        return {
          ...oldList,
          data: docs.map((d) =>
            d._id === variables.docId ? { ...d, title: data.data.title } : d
          ),
        };
      });
    },
  });
};

export const useDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleCurrentWorkspace = (workspaceId) =>
    useQuery({
      queryKey: ["currentWorkspace", workspaceId],
      queryFn: async () => {
        const response = await fetchCurrentWorkspace(workspaceId);
        dispatch(setWorkspace(response.data.workspace));
        return response.data.workspace;
      },
      enabled: !!workspaceId,
      staleTime: 5 * 60 * 1000,
    });

  const handleGetAllDocuments = (workspaceId) =>
    useQuery({
      queryKey: ["documents", workspaceId],
      queryFn: () => fetchDocuments(workspaceId),
      enabled: !!workspaceId,
      staleTime: 0,
    });

  const handleGetDocument = (documentId) =>
    useQuery({
      queryKey: ["document", documentId],
      queryFn: async () => {
        const res = await fetchDocumentById(documentId);
        return res.data;
      },
      enabled: !!documentId,
      staleTime: 5 * 60 * 1000,
    });

  const handleCreateDocument = () =>
    useMutation({
      mutationFn: createDocumentApi,
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["documents", variables.workspaceId] });
        navigate(`/documents/${variables.workspaceId}/document/${data.data._id}`);
      },
      onError: () => {},
    });

  return {
    handleCurrentWorkspace,
    handleGetAllDocuments,
    handleGetDocument,
    handleCreateDocument,
  };
};
