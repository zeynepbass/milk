import { useState, useEffect } from "react";
import { PostCard } from "@/features/posts/components/PostCard";
import { useComments } from "@/features/posts/hooks/useComments";
import { useExploreFeed } from "../../hooks/useExploreFeed";

export function FavoriteList() {
  const [selected, setSelected] = useState(null);
  const handleShowed = (id) => {
    setSelected((prev) => (prev === id ? null : id));
  };

  const { favorites, fetchSavedPosts, data, loading, user, followId, handlePostLike, handlePostSave } =
    useExploreFeed();

  const {
    handleComment,
    handleDelete,
    handleCommentLike,
    handleAddComment,
    comments,
    newComment,
    setNewComment,
  } = useComments(selected);
  useEffect(() => {
    fetchSavedPosts();
  }, [data, fetchSavedPosts]);
  return (
    <div className="h-[100vh] overflow-auto p-4 ">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
        <PostCard
          data={favorites}
          isFavoriteList
          selected={selected}
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          loading={loading}
          followId={followId}
          handleShowed={handleShowed}
          profileForm={user || {}}
          handlePostSave={handlePostSave}
          handlePostLike={handlePostLike}
          handleComment={handleComment}
          handleDelete={handleDelete}
          handleCommentLike={handleCommentLike}
          comments={comments || []}
        />{" "}
      </div>
    </div>
  );
}
