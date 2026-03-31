
import { useState,useEffect } from "react";
import usePostAll from "@/features/hooks/feed/posts/usePost";
import useCommentAll from "@/features/hooks/feed/comments/useComments";
import Card from "@/features/components/widgets/section/card";
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
        <div className="h-[100vh] overflow-auto p-4 ">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
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
              profileForm={user || {}}
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
