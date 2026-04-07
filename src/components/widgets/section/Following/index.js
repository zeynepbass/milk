import { useState } from "react";
import usePostAll from "@/features/hooks/feed/posts/usePost";
import usePost from "@/features/hooks/feed/user/useUserPost";
import useCommentAll from "@/features/hooks/feed/comments/useComments";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/atoms/Loading"
import Card from "@/components/molecules/Card";
import Sortered from "@/components/molecules/Sortered";
export function Following() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const handleShowed = (id) => {
    setSelected((prev) => (prev === id ? null : id));
  };

  const {

    loading,
    user,
    followId,
    handlePostLike,
    handlePostSave,
    open,
    setOpen,
  } = usePostAll();
  const { deleted, editPostId, setEditPostId,following } = usePost();
  const {
    handleComment,
    handleDelete,
    handleCommentLike,
    handleAddComment,
    comments,
    newComment,
    setNewComment,
  } = useCommentAll(selected);
  const sortedData = following.sort(
    (a, b) => b.user?.dogrulanmisSatici - a.user?.dogrulanmisSatici
  );
  if (loading) return <Loading />;

 <Sortered sortedData={sortedData} />;
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
          handleCommentLike={handleCommentLike}
          comments={comments || []}
        />{" "}
      </div>
    </div>
  );
}
