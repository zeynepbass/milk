import { useState } from "react";
import Card from "./card";
import usePostAll from "../../../hooks/feed/posts/usePost";
import useCommentAll from "../../../hooks/feed/comments/useComments";
export function Section() {
  const {
    data,
    loading,
    user,
    followId,
    handlePostLike,
    handlePostSave,
    showComments,
  } = usePostAll();
  const { handleComment, handleDelete, handleC0mmentLike, comments,handleShowed,selected } =
    useCommentAll(selected);
    const [newComment, setNewComment] = useState("");

    const handleAddComment = (id) => {
      handleComment(id, newComment);
      setNewComment("");
    };
  
  return (
    <div className="h-[100vh] overflow-auto ">
          <div className="grid grid-cols-3 gap-1">

  
    <Card
      data={data}
      newComment={newComment}
      setNewComment={setNewComment}
      handleAddComment={handleAddComment}
      loading={loading}
      selected={selected}
      followId={followId}
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
