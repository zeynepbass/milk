import { useEffect, useState } from "react";
import { postService } from "services/postServices";
import { useUserStore } from "../../store";
export default function usePost() {

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await postService.getPosts();

        setData(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
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
  
  return {data, loading, user, handlePostLike };
}
