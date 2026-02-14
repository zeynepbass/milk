import { useEffect, useState, useCallback } from "react";
import { commentService } from "services/commentService";
import { useUserStore } from "../../../store/useUserStore";

export default function usePostComment(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useUserStore((state) => state.token);
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await commentService.getComments(postId,token);
      setComments(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [postId]);


  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, fetchComments]);


  const handleComment = async (text) => {
    if (!text.trim()) return;

    try {
      const res = await commentService.postComment(postId, text, token);


      setComments((prev) => [res, ...prev]);

    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await commentService.deleteComment(id, token);
  
      setComments((prev) =>
        prev.filter((item) => item._id !== id)
      );
  
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async (commentId) => {
    try {
      const res = await commentService.likeComment(commentId, token);
  
      setComments(prev =>
        prev.map(comment =>
          comment._id === commentId
            ? {
                ...comment,
                likes: res.likes,
                likesCount: res.likesCount,
                liked: res.liked
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
    handleDelete,
    handleLike,
    loading,
    handleComment,
    refetch: fetchComments
  };
}
