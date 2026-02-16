import { useEffect, useState } from "react";
import { postService } from "services/postServices";
import { useUserStore } from "../../store";
import { commentService } from "services/commentService";

export default function usePostDetail(id) {
  const [details, setDetails] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await postService.postDetails(id, token);
        setDetails(res.post);
        setComments(res.comments);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleLike = async (commentId) => {
    try {
      const res = await commentService.likeComment(commentId, token);

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
    if (!text.trim()) return;

    try {
      const res = await commentService.postComment(postId, text, token);
      setComments((prev) => [res, ...prev]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(commentId, token);

      setComments((prev) => prev.filter((item) => item._id !== commentId));
    } catch (error) {
      console.log(error);
    }
  };
  const handlePostLike = async (postId) => {
    try {
      const res = await postService.postLike(postId, token);

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
      const res = await postService.postsavedBy(postId, token);

      setDetails((prev) => {
        if (!prev) return prev;

        const alreadySaved = prev.savedBy.includes(user.id);

        return {
          ...prev,
          savedBy: alreadySaved
            ? prev.savedBy.filter((u) => u !== user.id)
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
    handleLike,
    handleDelete,
    handleComment,
    comments,
    user,
    handlePostLike,
    handlePostSave,
  };
}
