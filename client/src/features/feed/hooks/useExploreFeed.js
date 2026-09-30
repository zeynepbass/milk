import { useEffect, useState } from "react";
import { useSearchStore } from "@/shared/store/useSearchStore";
import { useUserStore } from "@/shared/store/useUserStore";
import { postProvider } from "@/providers/post.provider";
import usePostActions from "@/features/feed/hooks/post/usePostActions";

export default function usePost() {
  const [openList, setOpenList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [favoruite, setfavoruite] = useState([]);
  const [open, setOpen] = useState(false);

  const search = useSearchStore((state) => state.search);
  const user = useUserStore((state) => state.user);

  const service = postProvider.service;
  const postActions = usePostActions();

  useEffect(() => {
    let ignore = false;

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await service.getPosts({
          search,
        });

        if (!ignore) {
          setData(res);
        }
      } catch (error) {
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }, 500);

    return () => {
      ignore = true;
      clearTimeout(timeout);
    };
  }, [search]);

  const handlePostLike = async (id) => {
    const res = await postActions.likePost(id);
    if (!res) return;

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
  };

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);

      const res = await service.getSavedPosts();

      setfavoruite(res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handlePostSave = async (id) => {
    const res = await postActions.savePost(id);
    if (!res) return;

    setData((prev) =>
      prev.map((post) => {
        if (post._id !== id) return post;

        const savedBy = Array.isArray(post.savedBy) ? post.savedBy : [];
        const userId = user?.id || user?._id;

        const alreadySaved = savedBy.some(
          (savedUser) => savedUser === userId || savedUser?._id === userId
        );

        return {
          ...post,
          savedBy: alreadySaved
            ? savedBy.filter(
                (savedUser) =>
                  savedUser !== userId && savedUser?._id !== userId
              )
            : [...savedBy, userId],
        };
      })
    );

    if (res.saved === false) {
      await fetchSavedPosts();
    }
  };

  const handleUpdatePost = async (id, formData) => {
    setLoading(true);

    const updatedPost = await postActions.updatePost(id, formData);

    setLoading(false);

    if (!updatedPost) return false;

    setData((prev) =>
      prev.map((post) => (post._id === id ? updatedPost : post))
    );

    setOpen(false);
    return true;
  };

  const handleDeletePost = async (id) => {
    const ok = await postActions.deletePost(id);
    if (!ok) return;

    setData((prev) => prev.filter((post) => post._id !== id));
  };

  const followId = async (id) => {
    try {
      await service.followUser(id);
      setOpenList(false);
    } catch (error) {}
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

    handleUpdatePost,
    handleDeletePost,

    openList,
    open,

    setOpen,
    setOpenList,
  };
}
