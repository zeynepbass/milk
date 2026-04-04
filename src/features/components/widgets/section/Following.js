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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        Yükleniyor...
      </div>
    );
  }


  if (!loading && sortedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center mt-16 px-4">
        <img
          src="/images/gonderi-bulunamadi.png"
          alt="Gönderi bulunamadı"
          className="w-40 h-40 object-contain opacity-80"
        />

        <h2 className="text-lg font-semibold text-gray-700 mb-1">
          Gönderi Bulunamadı
        </h2>

        <p className="text-gray-400 text-sm m-1">
          Henüz paylaşılmış bir gönderi bulunamadı
        </p>
      </div>
    );
  }
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
          handleC0mmentLike={handleC0mmentLike}
          comments={comments || []}
        />{" "}
      </div>
    </div>
  );
}
