import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { useSearchStore } from "@/shared/store/useSearchStore";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { postService } from "@/features/posts/services/post.service";
import { toggleSavedBy, usePostActions } from "@/features/posts/hooks/usePostActions";
import { accountService } from "@/features/auth/services/account.service";

const SEARCH_DEBOUNCE_MS = 500;

export function useExploreFeed() {
  const [openList, setOpenList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [open, setOpen] = useState(false);

  const search = useSearchStore((state) => state.search);
  const user = useAuthStore((state) => state.user);
  const postActions = usePostActions();

  useEffect(() => {
    let ignore = false;

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const posts = await postService.getPosts({ search });
        if (!ignore) setData(posts);
      } catch (error) {
        if (!ignore) toast.error(getErrorMessage(error, "Gönderiler alınamadı"));
      } finally {
        if (!ignore) setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      ignore = true;
      clearTimeout(timeout);
    };
  }, [search]);

  const fetchSavedPosts = useCallback(async () => {
    setLoading(true);

    try {
      setFavorites(await postService.getSavedPosts());
    } catch (error) {
      toast.error(getErrorMessage(error, "Kaydedilen gönderiler alınamadı"));
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePostLike = async (id) => {
    const result = await postActions.likePost(id);
    if (!result) return;

    const applyLike = (post) =>
      post._id === id ? { ...post, likes: result.likes, liked: result.liked } : post;
    setData((prev) => prev.map(applyLike));
    setFavorites((prev) => prev.map(applyLike));
  };

  const handlePostSave = async (id) => {
    const result = await postActions.savePost(id);
    if (!result) return;

    setData((prev) => prev.map((post) => (post._id === id ? toggleSavedBy(post, user?._id) : post)));

    if (result.saved === false) {
      await fetchSavedPosts();
    }
  };

  const handleUpdatePost = async (id, formData) => {
    setLoading(true);
    const updatedPost = await postActions.updatePost(id, formData);
    setLoading(false);

    if (!updatedPost) return false;

    setData((prev) => prev.map((post) => (post._id === id ? updatedPost : post)));
    setOpen(false);
    return true;
  };

  const handleDeletePost = async (id) => {
    const ok = await postActions.deletePost(id);
    if (ok) setData((prev) => prev.filter((post) => post._id !== id));
  };

  const followId = async (id) => {
    try {
      const result = await accountService.toggleFollow(id);
      toast.info(result.message);
      setOpenList(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Takip işlemi başarısız oldu."));
    }
  };

  return {
    data,
    loading,
    user,
    handlePostLike,
    handlePostSave,
    fetchSavedPosts,
    favorites,
    followId,
    handleUpdatePost,
    handleDeletePost,
    openList,
    open,
    setOpen,
    setOpenList,
  };
}
