import { useEffect, useState } from "react";
import { postService } from "services/postServices";
import { useUserStore,useSearchStore } from "../../../store";
export default function usePost() {
  const [openList, setOpenList] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState([]);
  const search = useSearchStore((state) => state.search);
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await postService.getPosts(search);
        setData([...res]); 
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [search]); 
  
  

  const handlePostLike = async (id) => {
    try {
      const res = await postService.postLike(id, token);
  
      setData((prev) =>
        prev.map((post) =>
          post._id === id
            ? {
                ...post,
                likes: res.likes, 
                liked: res.liked,
              }
            : post
        )
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handlePostSave = async (id) => {
    try {
      const res = await postService.postsavedBy(id, token);
  
      setData((prev) =>
        prev.map((post) => {
          if (post._id !== id) return post;
  
          const alreadySaved = post.savedBy.includes(user.id);
  
          return {
            ...post,
            savedBy: alreadySaved
              ? post.savedBy.filter((u) => u !== user.id)
              : [...post.savedBy, user.id],
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };


  const followId=async(id)=>{
    try {
 await postService.followById(id, token);
      setRefresh(prev => !prev);
      setOpenList(false)
    } catch (error) {
      console.log(error);
    }
  }
  return {data, loading, user, handlePostLike,handlePostSave,followId,refresh,openList, setOpenList};
}
