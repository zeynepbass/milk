import { useState } from "react";
import { Loading } from "@/shared/components/atoms";
import { EmptyPostList } from "@/shared/components/molecules";
import { PostCard } from "@/features/posts/components/PostCard";
import { useComments } from "@/features/posts/hooks/useComments";
import { useExploreFeed } from "../../hooks/useExploreFeed";

export function ExploreFeed() {
  const [selected, setSelected] = useState(null);
  const [editPostId, setEditPostId] = useState(null);

  const handleShowed = (id) => {
    setSelected((prev) => (prev === id ? null : id));
  };

  const {
    data,
    loading,
    user,
    followId,
    handlePostLike,
    handlePostSave,
    handleDeletePost,
    handleUpdatePost,
    open,
    setOpen,
  } = useExploreFeed();

  const {
    handleComment,
    handleDelete,
    handleCommentLike,
    handleAddComment,
    comments,
    newComment,
    setNewComment,
  } = useComments(selected);

  const sortedData = [...(data || [])].sort((a, b) => b.user?.dogrulanmisSatici - a.user?.dogrulanmisSatici);

  if (loading) return <Loading />;

  return (
    <div className="h-[100vh] overflow-auto p-4">
      <EmptyPostList items={sortedData} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <PostCard
          data={sortedData || []}
          selected={selected}
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          editPostId={editPostId}
          setEditPostId={setEditPostId}
          followId={followId}
          setOpen={setOpen}
          deleted={handleDeletePost}
          onUpdatePost={handleUpdatePost}
          open={open}
          handleShowed={handleShowed}
          profileForm={user || ""}
          handlePostSave={handlePostSave}
          handlePostLike={handlePostLike}
          handleComment={handleComment}
          handleDelete={handleDelete}
          handleCommentLike={handleCommentLike}
          comments={comments || []}
        />
      </div>
    </div>
  );
}
