import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { queryKeys } from "@/shared/query/queryKeys";
import {
  filterInfiniteItems,
  mapInfiniteItems,
  pageParamsFromCursor,
  prependInfiniteItem,
} from "@/shared/query/infinite";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { commentService } from "../services/comment.service";

export function useComments(postId, { enabled = true } = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.comments(postId),
    queryFn: ({ pageParam }) => commentService.getComments(postId, { cursor: pageParam }),
    enabled: Boolean(postId) && enabled,
    ...pageParamsFromCursor,
  });
}

const useCommentsCache = (postId) => {
  const queryClient = useQueryClient();
  const key = queryKeys.posts.comments(postId);

  return {
    queryClient,
    key,
    snapshot: async () => {
      await queryClient.cancelQueries({ queryKey: key });
      return queryClient.getQueryData(key);
    },
    restore: (previous) => queryClient.setQueryData(key, previous),
    update: (updater) => queryClient.setQueryData(key, updater),
  };
};

export function useAddComment(postId) {
  const cache = useCommentsCache(postId);
  const { data: me } = useCurrentUser();

  return useMutation({
    mutationFn: (text) => commentService.addComment(postId, text),
    onMutate: async (text) => {
      const previous = await cache.snapshot();
      const optimistic = {
        _id: `pending-${Date.now()}`,
        text: text.trim(),
        user: me,
        likesCount: 0,
        likedByMe: false,
        createdAt: new Date().toISOString(),
        pending: true,
      };
      cache.update((data) => prependInfiniteItem(data, optimistic));
      return { previous, optimisticId: optimistic._id };
    },
    onError: (error, text, context) => {
      cache.restore(context?.previous);
      toast.error(getErrorMessage(error, "Yorum gönderilemedi"));
    },
    onSuccess: (comment, text, context) => {
      cache.update((data) =>
        mapInfiniteItems(data, (item) => (item._id === context.optimisticId ? comment : item))
      );
    },
  });
}

export function useCommentLike(postId) {
  const cache = useCommentsCache(postId);

  return useMutation({
    mutationFn: ({ commentId, liked }) => commentService.setLike(commentId, liked),
    onMutate: async ({ commentId, liked }) => {
      const previous = await cache.snapshot();
      cache.update((data) =>
        mapInfiniteItems(data, (comment) =>
          comment._id === commentId && comment.likedByMe !== liked
            ? { ...comment, likedByMe: liked, likesCount: Math.max(0, comment.likesCount + (liked ? 1 : -1)) }
            : comment
        )
      );
      return { previous };
    },
    onError: (error, variables, context) => {
      cache.restore(context?.previous);
      toast.error(getErrorMessage(error, "Beğeni işlemi başarısız oldu."));
    },
  });
}

export function useDeleteComment(postId) {
  const cache = useCommentsCache(postId);

  return useMutation({
    mutationFn: (commentId) => commentService.deleteComment(commentId),
    onMutate: async (commentId) => {
      const previous = await cache.snapshot();
      cache.update((data) => filterInfiniteItems(data, (comment) => comment._id !== commentId));
      return { previous };
    },
    onError: (error, commentId, context) => {
      cache.restore(context?.previous);
      toast.error(getErrorMessage(error, "Yorum silinemedi"));
    },
  });
}
