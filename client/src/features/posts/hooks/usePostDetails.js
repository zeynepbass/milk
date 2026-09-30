import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { postService } from "../services/post.service";
import { commentService } from "../services/comment.service";
import { toggleSavedBy, usePostActions } from "./usePostActions";

export function usePostDetails(postId) {
  const [details, setDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const user = useAuthStore((state) => state.user);
  const postActions = usePostActions();

  const fetchData = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    try {
      const result = await postService.getPostDetails(postId);
      setDetails(result.post);
      setComments(result.comments);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gönderi alınamadı"));
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLike = async (commentId) => {
    try {
      const result = await commentService.likeComment(commentId);

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, likes: result.likes, likesCount: result.likesCount, liked: result.liked }
            : comment
        )
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Beğeni işlemi başarısız oldu."));
    }
  };

  const handleComment = async (targetPostId, text) => {
    if (!text?.trim()) return;

    try {
      const comment = await commentService.postComment(targetPostId, text);
      setComments((prev) => [comment, ...prev]);
    } catch (error) {
      toast.error(getErrorMessage(error, "Yorum gönderilemedi"));
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((item) => item._id !== commentId));
    } catch (error) {
      toast.error(getErrorMessage(error, "Yorum silinemedi"));
    }
  };

  const handlePostLike = async (targetPostId) => {
    const result = await postActions.likePost(targetPostId);
    if (!result) return;

    setDetails((prev) => (prev ? { ...prev, likes: result.likes, liked: result.liked } : prev));
  };

  const handlePostSave = async (targetPostId) => {
    const result = await postActions.savePost(targetPostId);
    if (!result) return;

    setDetails((prev) => (prev ? toggleSavedBy(prev, user?._id) : prev));
  };

  const handleDeletePost = (targetPostId) => postActions.deletePost(targetPostId);

  return {
    details,
    loading,
    comments,
    user,
    handleLike,
    handleDelete,
    handleComment,
    handlePostLike,
    handlePostSave,
    handleDeletePost,
    fetchData,
    showComments,
    setShowComments,
  };
}
