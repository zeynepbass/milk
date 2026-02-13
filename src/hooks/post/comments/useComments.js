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

  return {
    comments,
    loading,
    handleComment,
    refetch: fetchComments
  };
}
