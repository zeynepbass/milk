import { useEffect, useState } from "react";
import { postProvider } from "@/providers/post.provider";
import {
  useSearchStore
} from "@/shared/store/useSearchStore";
import {
  useUserStore
} from "@/shared/store/useUserStore";
import { toast } from "react-toastify";
import usePostActions from "@/features/feed/hooks/post/usePostActions";

export default function useMyPosts() {
  const [details, setDetails] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [following, setFollowing] = useState([]);
  const [loadingPost, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);

  const user = useUserStore((state) => state.user);
  const search = useSearchStore((state) => state.search);

  const postService = postProvider.service;
  const postActions = usePostActions();

  const [form, setForm] = useState({
    ownerName: user?.name,
    ownerSurname: user?.surname,
    ownerRole: user?.role,
    title: "",
    description: "",
    district: user?.district,
    image: user?.avatar,
    province: user?.province,
    category: "",
    images: [],
  });

  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      ownerName: user.name,
      ownerSurname: user.surname,
      ownerRole: user.role,
      title: "",
      description: "",
      district: user.district,
      province: user.province,
      category: "",
      images: [],
    }));
  }, [user]);

  useEffect(() => {
    let ignore = false;

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await postService.getFollowingPosts({
          search,
        });

        if (!ignore) {
          setFollowing(res);
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

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await postService.getMyPosts();

      setDetails(res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (formData) => {
    try {
      setPostLoading(true);

      const res = await postService.createPost(formData);

      toast.success(res.message || "Başarılı");

      setDetails((prev) => [res.post, ...prev]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Hata oluştu."
      );
    } finally {
      setPostLoading(false);
    }
  };

  const deleted = async (postId) => {
    const ok = await postActions.deletePost(postId);
    if (!ok) return;

    setDetails((prev) => prev.filter((item) => item._id !== postId));
  };

  const handlePostLike = async (id) => {
    const res = await postActions.likePost(id);
    if (!res) return;

    setDetails((prev) =>
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

  const handlePostSave = async (id) => {
    const res = await postActions.savePost(id);
    if (!res) return;

    const userId = user?.id || user?._id;

    setDetails((prev) =>
      prev.map((post) => {
        if (post._id !== id) return post;

        const savedBy = Array.isArray(post.savedBy) ? post.savedBy : [];

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
  };

  const handleUpdatePost = async (id, formData) => {
    setLoading(true);

    const updatedPost = await postActions.updatePost(id, formData);

    setLoading(false);

    if (!updatedPost) return false;

    setDetails((prev) =>
      prev.map((post) => (post._id === id ? updatedPost : post))
    );

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
