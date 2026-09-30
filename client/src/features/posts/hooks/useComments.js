import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { commentService } from "../services/comment.service";

const applyLikeResult = (commentId, result) => (comment) =>
  comment._id === commentId
    ? { ...comment, likes: result.likes, likesCount: result.likesCount, liked: result.liked }
    : comment;

export function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");

  const fetchComments = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    try {
      setComments(await commentService.getComments(postId));
    } catch (error) {
      toast.error(getErrorMessage(error, "Yorumlar alınamadı"));
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleComment = async (targetPostId, text) => {
    if (!text?.trim()) return;

    try {
      const comment = await commentService.postComment(targetPostId, text);
      setComments((prev) => [comment, ...prev]);
    } catch (error) {
      toast.error(getErrorMessage(error, "Yorum gönderilemedi"));
    }
  };

  const handleAddComment = async (targetPostId) => {
    if (!newComment.trim()) return;

    await handleComment(targetPostId, newComment);
    setNewComment("");
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((item) => item._id !== commentId));
    } catch (error) {
      toast.error(getErrorMessage(error, "Yorum silinemedi"));
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const result = await commentService.likeComment(commentId);
      setComments((prev) => prev.map(applyLikeResult(commentId, result)));
    } catch (error) {
      toast.error(getErrorMessage(error, "Beğeni işlemi başarısız oldu."));
    }
  };

  return {
    comments,
    loading,
    newComment,
    setNewComment,
    handleAddComment,
    handleComment,
    handleDelete,
    handleCommentLike,
    refetch: fetchComments,
  };
}
