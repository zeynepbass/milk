import Card from "../section/card";
import { useState } from "react";
import usePostAll from "../../../hooks/feed/posts/usePost";
import useCommentAll from "../../../hooks/feed/comments/useComments";
import { useEffect } from "react";
export function Favorite() {

 
    const [selected, setSelected] = useState(null);
    const handleShowed = (id) => {
      setSelected((prev) => (prev === id ? null : id));
  
    };

    const {favoruite, fetchSavedPosts,data,loading, user, followId, handlePostLike, handlePostSave } =
      usePostAll();
  
    const { handleComment, handleDelete, handleC0mmentLike,handleAddComment, comments,   newComment,
      setNewComment } =
      useCommentAll(selected);
      useEffect(() => {
        fetchSavedPosts();
      }, [data]);
  return (
        <div className="h-[100vh] overflow-auto ">
          <div className="grid grid-cols-3 gap-1">
            <Card
              data={favoruite || []}
              favoruite={favoruite || ""}
              selected={selected}
              newComment={newComment}
              setNewComment={setNewComment}
              handleAddComment={handleAddComment}
              loading={loading}
              followId={followId}
    
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
