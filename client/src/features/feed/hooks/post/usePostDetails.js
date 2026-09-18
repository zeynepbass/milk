import { useEffect, useState } from "react";
import { useUserStore } from "@/shared/store/useUserStore";

import { postProvider } from "@/providers/post.provider";
import { commentProvider } from "@/providers/comment.provider";
import usePostActions from "@/features/feed/hooks/post/usePostActions";

export default function usePostDetail(id) {
  const [details, setDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const user = useUserStore((state) => state.user);

  const postService = postProvider.service;
  const commentService = commentProvider.service;
  const postActions = usePostActions();

  const fetchData = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const res = await postService.getPostDetails(id);

      setDetails(res.post);
      setComments(res.comments);
    } catch (error) {
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
    }
  };

  const handlePostLike = async (postId) => {
    const res = await postActions.likePost(postId);
    if (!res) return;

    setDetails((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        likes: res.likes,
        liked: res.liked,
      };
    });
  };

  const handlePostSave = async (postId) => {
    const res = await postActions.savePost(postId);
    if (!res) return;

    const userId = user?.id || user?._id;

    setDetails((prev) => {
      if (!prev) return prev;

      const savedBy = Array.isArray(prev.savedBy) ? prev.savedBy : [];

      const alreadySaved = savedBy.some(
        (savedUser) => savedUser === userId || savedUser?._id === userId
      );

      return {
        ...prev,
        savedBy: alreadySaved
          ? savedBy.filter(
              (savedUser) =>
                savedUser !== userId && savedUser?._id !== userId
            )
          : [...savedBy, userId],
      };
    });
  };

  const handleDeletePost = async (postId) => {
    return await postActions.deletePost(postId);
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
    handleDeletePost,

    fetchData,

    showComments,
    setShowComments,
  };
}