import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { queryKeys } from "@/shared/query/queryKeys";
import { postService } from "../services/post.service";
import { applyLike, applySave, restorePosts, snapshotPosts, updatePostEverywhere } from "./postCache";

const useOptimisticPostMutation = ({ mutationFn, applyOptimistic, applyResult, errorMessage, onSettled }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.all });
      const snapshot = snapshotPosts(queryClient);
      updatePostEverywhere(queryClient, variables.postId, applyOptimistic(variables));
      return { snapshot };
    },
    onError: (error, variables, context) => {
      restorePosts(queryClient, context?.snapshot);
      toast.error(getErrorMessage(error, errorMessage));
    },
    onSuccess: (result, variables) => {
      updatePostEverywhere(queryClient, variables.postId, (post) => ({ ...post, ...applyResult(result) }));
    },
    onSettled: () => onSettled?.(queryClient),
  });
};

export function usePostLike() {
  return useOptimisticPostMutation({
    mutationFn: ({ postId, liked }) => postService.setLike(postId, liked),
    applyOptimistic: ({ liked }) => applyLike(liked),
    applyResult: (result) => ({ likedByMe: result.liked, likesCount: result.likesCount }),
    errorMessage: "Beğeni işlemi başarısız oldu.",
  });
}

export function usePostSave() {
  return useOptimisticPostMutation({
    mutationFn: ({ postId, saved }) => postService.setSave(postId, saved),
    applyOptimistic: ({ saved }) => applySave(saved),
    applyResult: (result) => ({ savedByMe: result.saved, savesCount: result.savesCount }),
    errorMessage: "Kaydetme işlemi başarısız oldu.",
    onSettled: (queryClient) => queryClient.invalidateQueries({ queryKey: queryKeys.posts.list("saved") }),
  });
}
