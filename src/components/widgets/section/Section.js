import { useState } from "react";
import Card from "./card";
import usePostAll from "../../../hooks/post/usePost";
import useCommentAll from "../../../hooks/post/comments/useComments";
export function Section() {
  const [showComments, setShowComments] = useState(false);
  const [selected, setSelected] = useState(null);
  const handleShowed = (id) => {
    setSelected(id);
    setShowComments(!showComments);
  };
  const {
    data = [],
    loading,
    user,
    handlePostLike,
    handlePostSave,
  } = usePostAll();
  const { handleComment, handleDelete, handleC0mmentLike, comments } =
    useCommentAll(selected);

  return (
    <div className="h-[100vh] overflow-auto ">
          <div className="grid grid-cols-3 gap-1">

  
    <Card
      data={data}
      loading={loading}
      selected={selected}
      showComments={showComments}
      handleShowed={handleShowed}
      user={user}
      handlePostSave={handlePostSave}
      handlePostLike={handlePostLike}
      handleComment={handleComment}
      handleDelete={handleDelete}
      handleC0mmentLike={handleC0mmentLike}
      comments={comments}
    />        </div>
    </div>

  );
}
