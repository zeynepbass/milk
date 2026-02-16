import { useEffect, useState } from "react";
import { postService } from "services/postServices";
import { useUserStore } from "../../store";

export default function usePostDetail(id) {
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await postService.postDetails(id, token);
        setDetails(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePostLike = async (id) => {
    try {
      const res = await postService.postLike(id, token);

      setDetails((prev) => {
        if (!prev) return prev;
      
        return {
          ...prev,
          post: {
            ...prev.post,
            likes: res.likes ?? prev.post.likes,
            liked: res.liked ?? prev.post.liked
          }
        };
      });
      
    } catch (error) {
      console.log(error);
    }
  };

  return { details, loading, handlePostLike };
}

