import { useState } from "react";
import usePostAll from "@/features/hooks/feed/posts/usePost";
import usePost from "@/features/hooks/feed/user/useUserPost";
import useCommentAll from "@/features/hooks/feed/comments/useComments";
import { useNavigate } from "react-router-dom";
import Card from "./card";
export function Following() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const handleShowed = (id) => {
    setSelected((prev) => (prev === id ? null : id));
  };

  const {
    following,
    loading,
    user,
    followId,
    handlePostLike,
    handlePostSave,
    open,
    setOpen,
  } = usePostAll();
  const { deleted, editPostId, setEditPostId } = usePost();
  const {
    handleComment,
    handleDelete,
    handleC0mmentLike,
    handleAddComment,
    comments,
    newComment,
    setNewComment,
  } = useCommentAll(selected);
  const sortedData = following.sort(
    (a, b) => b.user?.dogrulanmisSatici - a.user?.dogrulanmisSatici
  );

  return (
    <div className="h-[100vh] overflow-auto p-4 ">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <Card
        navigate={navigate}
          data={sortedData || []}
          selected={selected}
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          loading={loading}
          editPostId={editPostId}
          setEditPostId={setEditPostId}
          followId={followId}
          setOpen={setOpen || true}
          deleted={deleted}
          open={open || false}
          handleShowed={handleShowed}
          profileForm={user || ""}
          handlePostSave={handlePostSave}
          handlePostLike={handlePostLike}
          handleComment={handleComment}
          handleDelete={handleDelete}
          handleC0mmentLike={handleC0mmentLike}
          comments={comments || []}
        />{" "}
      </div>
    </div>
  );
}
