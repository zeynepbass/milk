import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { queryKeys } from "@/shared/query/queryKeys";
import { postService } from "../services/post.service";
import { removePostEverywhere, updatePostEverywhere } from "./postCache";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input) => postService.createPost(input),
    onSuccess: (result) => {
      toast.success(result.message || "İlan oluşturuldu");
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Gönderi oluşturulamadı.")),
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, ...input }) => postService.updatePost(postId, input),
    onSuccess: (result, { postId }) => {
      toast.info(result.message || "Gönderi güncellendi");
      updatePostEverywhere(queryClient, postId, () => result.post);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Gönderi güncellenirken bir hata oluştu.")),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => postService.deletePost(postId),
    onSuccess: (result, postId) => {
      toast.info(result.message || "Gönderi kaldırıldı");
      removePostEverywhere(queryClient, postId);
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(postId) });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Gönderi silinirken bir hata oluştu.")),
  });
}
