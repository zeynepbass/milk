import { useEffect, useState } from "react";
import { useUserStore } from "@/shared/store";

import { postProvider } from "@/features/feed/providers/post.provider";
import { commentProvider } from "@/features/feed/providers/comment.provider";

export default function usePostDetail(id) {
  const [details, setDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const user = useUserStore((state) => state.user);

  const postService = postProvider.service;
  const commentService = commentProvider.service;

  const fetchData = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const res = await postService.getPostDetails(id);

      setDetails(res.post);
      setComments(res.comments);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleLike = async (commentId) => {
    try {
      const res =
        await commentService.likeComment(commentId);

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

  const handleComment = async (postId, text) => {
    if (!text?.trim()) return;

    try {
      const res =
        await commentService.postComment(
          postId,
          text
        );

      setComments((prev) => [res, ...prev]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);

      setComments((prev) =>
        prev.filter(
          (item) => item._id !== commentId
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostLike = async (postId) => {
    try {
      const res =
        await postService.likePost(postId);

      setDetails((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          likes: res.likes,
          liked: res.liked,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostSave = async (postId) => {
    try {
      await postService.savePost(postId);

      setDetails((prev) => {
        if (!prev) return prev;

        const alreadySaved =
          Array.isArray(prev.savedBy) &&
          prev.savedBy.includes(user.id);

        return {
          ...prev,
          savedBy: alreadySaved
            ? prev.savedBy.filter(
                (u) => u !== user.id
              )
            : [...prev.savedBy, user.id],
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

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

    fetchData,

    showComments,
    setShowComments,
  };
}