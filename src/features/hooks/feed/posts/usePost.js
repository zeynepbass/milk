import { useEffect, useState } from "react";
import { postService } from "features/services/postServices";
import { useUserStore, useSearchStore } from "../../../../store";
export default function usePost() {
  const [openList, setOpenList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState([]);
  const [favoruite, setfavoruite] = useState([]);
  const [open, setOpen] = useState(false);
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
  }, [search, token]);

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
  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      const res = await postService.getSavedPosts(token);
      setfavoruite(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handlePostSave = async (id) => {

    try {
      const res = await postService.postsavedBy(id, token);

      setData((prev) =>
        prev.map((post) => {
          if (post._id !== id) return post;

          const alreadySaved =
            Array.isArray(post.savedBy) && post.savedBy.includes(user.id);

          return {
            ...post,
            savedBy: alreadySaved
              ? post.savedBy.filter((u) => u !== user.id)
              : [...post.savedBy, user.id],
          };
        })
      );
      if (res.saved === false) {
        fetchSavedPosts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatePost = async (id, formData) => {
    try {
      setLoading(true);
  

      const updatedPost = await postService.updatePost(id, formData, token);
      
      setData((prev) =>
        prev.map((post) => (post._id === id ? updatedPost : post))
      );
  
      setOpen(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const followId = async (id) => {
    try {

      await postService.followById(id, token);
      setRefresh((prev) => !prev);
      setOpenList(false);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    data,
    loading,
    user,
    handlePostLike,
    handlePostSave,
    fetchSavedPosts,
    favoruite,
    followId,
    refresh,
    handleUpdatePost,
    openList,
    open,
    setOpen,
    setOpenList,
  };
}
