import { useState } from "react";
import usePostAll from "../../../hooks/feed/posts/usePost";
import usePost from "../../../hooks/feed/user/useUserPost";
import useCommentAll from "../../../hooks/feed/comments/useComments";
import { useNavigate } from "react-router-dom";
import Card from "./card";
export function Section() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
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
  const sortedData = data.sort(
    (a, b) => b.user?.dogrulanmisSatici - a.user?.dogrulanmisSatici
  );

  return (
    <div className="h-[100vh] overflow-auto ">
      <div className="grid grid-cols-3 gap-1">
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
          user={user || {}}
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
