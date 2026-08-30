import { useEffect, useState, useCallback } from "react";
import { commentProvider } from "@/providers/comment.provider";

export default function usePostComment(id) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");


  const service = commentProvider.service;

  const fetchComments = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      const res = await service.getComments(id);

      setComments(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [id, service]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleComment = async (commentId, text) => {
    if (!text?.trim()) return;

    try {
      const res = await service.postComment(
        commentId,
        text
      );

      setComments((prev) => [res, ...prev]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddComment = async (commentId) => {
    if (!newComment.trim()) return;

    try {
      await handleComment(
        commentId,
        newComment
      );

      setNewComment("");
    } catch (error) {
      console.log("Yorum ekleme hatası:", error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await service.deleteComment(commentId);

      setComments((prev) =>
        prev.filter(
          (item) => item._id !== commentId
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const res =
        await service.likeComment(commentId);

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: res.likes,
                likesCount: res.likesCount,
                liked: res.liked,
              }
            : comment
        )
      );
    } catch (error) {
      console.log(error);
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