import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMessages, postMessage } from "../services/chat.api";

export const useMessages = (workspaceId) =>
  useQuery({
    queryKey: ["messages", workspaceId],
    queryFn: () => fetchMessages(workspaceId),
    enabled: !!workspaceId,
    staleTime: 0,
    select: (data) => data.data ?? [],
  });

export const useSendMessage = (workspaceId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postMessage,
    onMutate: async ({ content }) => {
      await queryClient.cancelQueries({ queryKey: ["messages", workspaceId] });
      const previous = queryClient.getQueryData(["messages", workspaceId]);

      queryClient.setQueryData(["messages", workspaceId], (old) => {
        const currentData = old?.data ?? [];
        const optimistic = {
          _id: `optimistic-${Date.now()}`,
          content,
          createdAt: new Date().toISOString(),
          senderId: { _optimistic: true },
        };
        return { ...old, data: [...currentData, optimistic] };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["messages", workspaceId], context.previous);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["messages", workspaceId], (old) => {
        const filtered = (old?.data ?? []).filter((m) => !m._id?.startsWith("optimistic-"));
        return { ...old, data: [...filtered, data.data] };
      });
    },
  });
};
