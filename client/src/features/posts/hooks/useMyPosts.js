import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { useSearchStore } from "@/shared/store/useSearchStore";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { postService } from "../services/post.service";
import { toggleSavedBy, usePostActions } from "./usePostActions";

const SEARCH_DEBOUNCE_MS = 500;

const initialForm = (user) => ({
  ownerName: user?.name,
  ownerSurname: user?.surname,
  ownerRole: user?.role,
  title: "",
  description: "",
  district: user?.district,
  province: user?.province,
  category: "",
  images: [],
});

export function useMyPosts() {
  const [details, setDetails] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [following, setFollowing] = useState([]);
  const [loadingPost, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);

  const user = useAuthStore((state) => state.user);
  const search = useSearchStore((state) => state.search);
  const postActions = usePostActions();

  const [form, setForm] = useState(() => initialForm(user));

  useEffect(() => {
    if (user) setForm(initialForm(user));
  }, [user]);

  useEffect(() => {
    let ignore = false;

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const posts = await postService.getFollowingPosts({ search });
        if (!ignore) setFollowing(posts);
      } catch (error) {
        if (!ignore) toast.error(getErrorMessage(error, "Takip edilen gönderiler alınamadı"));
      } finally {
        if (!ignore) setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      ignore = true;
      clearTimeout(timeout);
    };
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      setDetails(await postService.getMyPosts());
    } catch (error) {
      toast.error(getErrorMessage(error, "Gönderiler alınamadı"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSubmit = async (formData) => {
    setPostLoading(true);

    try {
      const result = await postService.createPost(formData);
      toast.success(result.message || "Başarılı");
      setDetails((prev) => [result.post, ...prev]);
    } catch (error) {
      toast.error(getErrorMessage(error, "Hata oluştu."));
    } finally {
      setPostLoading(false);
    }
  };

  const deleted = async (postId) => {
    const ok = await postActions.deletePost(postId);
    if (ok) setDetails((prev) => prev.filter((item) => item._id !== postId));
  };

  const handlePostLike = async (id) => {
    const result = await postActions.likePost(id);
    if (!result) return;

    setDetails((prev) =>
      prev.map((post) => (post._id === id ? { ...post, likes: result.likes, liked: result.liked } : post))
    );
  };

  const handlePostSave = async (id) => {
    const result = await postActions.savePost(id);
    if (!result) return;

    setDetails((prev) => prev.map((post) => (post._id === id ? toggleSavedBy(post, user?._id) : post)));
  };

  const handleUpdatePost = async (id, formData) => {
    setLoading(true);
    const updatedPost = await postActions.updatePost(id, formData);
    setLoading(false);

    if (!updatedPost) return false;

    setDetails((prev) => prev.map((post) => (post._id === id ? updatedPost : post)));
    return true;
  };

  return {
    details,
    following,
    onSubmit,
    postLoading,
    loadingPost,
    setForm,
    form,
    deleted,
    handlePostLike,
    handlePostSave,
    handleUpdatePost,
    user,
    editPostId,
    setEditPostId,
  };
}
