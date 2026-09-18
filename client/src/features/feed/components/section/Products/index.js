import { useState } from "react";
import usePostAll from "@/features/feed/hooks/post/usePost";
import useCommentAll from "@/features/feed/hooks/comments/useComments";
import { useNavigate } from "react-router-dom";
import {Loading} from "@/shared/components/atoms"
import {Sortered,Card} from "@/shared/components/molecules"
export function Section() {
  const navigate = useNavigate();
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
  } = usePostAll();

  const {
    handleComment,
    handleDelete,
    handleCommentLike,
    handleAddComment,
    comments,
    newComment,
    setNewComment,
  } = useCommentAll(selected);

  const sortedData = [...(data || [])].sort(
    (a, b) => b.user?.dogrulanmisSatici - a.user?.dogrulanmisSatici
  );

  if (loading) return <Loading />;

  return (
    <div className="h-[100vh] overflow-auto p-4">
      <Sortered sortedData={sortedData} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <Card
          navigate={navigate}
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
