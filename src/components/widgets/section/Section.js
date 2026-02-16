import { useState } from "react";
import Card from "./card"
import usePostAll from "../../../hooks/post/usePost";
import useCommentAll from "../../../hooks/post/comments/useComments";
export function Section(){
    const [showComments, setShowComments] = useState(false);
    const [selected,setSelected]=useState(null)
    const handleShowed=(id)=>{
      setSelected(id)
      setShowComments(!showComments)
    }
      const { data = [], loading, user, handlePostLike,handlePostSave } = usePostAll();
      const { handleComment, handleDelete, handleLike, comments } = useCommentAll(selected);


    return(
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
        handleLike={handleLike}
        comments={comments}
        />
    )
}