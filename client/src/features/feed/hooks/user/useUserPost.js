import { useEffect, useState } from "react";
import { postProvider } from "@/providers/post.provider";
import {
  useSearchStore
} from "@/shared/store/useSearchStore";
import {
  useUserStore
} from "@/shared/store/useUserStore";
import { toast } from "react-toastify";
export default function usePostDetail() {
  const [details, setDetails] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [following, setFollowing] = useState([]);
  const [loadingPost, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [feedback, setFeeback] = useState(false);

  const user = useUserStore((state) => state.user);
  const search = useSearchStore((state) => state.search);

  const postService = postProvider.service;

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
        console.log(error);
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
      console.log(error);
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
  
      console.log("mesaj:", res.message);
  
      toast.success(res.message || "Başarılı");
  
      setDetails((prev) => [res.post, ...prev]);
    } catch (error) {
      console.log(error);
  
      toast.error(
        error.response?.data?.message ||
          "Hata oluştu."
      );
    } finally {
      setPostLoading(false);
    }
  };

  const deleted = async (postId) => {
    try {

      setDetails((prev) =>
        prev.filter(
          (item) => item._id !== postId
        )
      );

      await postService.deletePost(postId);
    } catch (error) {
      console.log(error);
    }
  };


  const handlePostLike = async (id) => {
    try {
      const res =
        await postService.likePost(id);

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
    } catch (error) {
      console.log(error);
    }
  };


  const onSubmitFeedback = async (payload) => {
    try {
      setFeeback(true);

      const res =  await postService.sendFeedback(payload);
            toast.info(res.message || "Başarılı");
    } catch (error) {
      console.log(
        "Feedback error:",
        error
      );
    } finally {
      setFeeback(false);
    }
  };


  const handlePostSave = async (id) => {
    try {
      await postService.savePost(id);

      setDetails((prev) =>
        prev.map((post) => {
          if (post._id !== id) {
            return post;
          }

          const alreadySaved =
            Array.isArray(post.savedBy) &&
            post.savedBy.includes(user.id);

          return {
            ...post,
            savedBy: alreadySaved
              ? post.savedBy.filter(
                  (u) => u !== user.id
                )
              : [
                  ...post.savedBy,
                  user.id,
                ],
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return {
    details,
    feedback,
    following,

    onSubmitFeedback,
    onSubmit,

    postLoading,
    loadingPost,

    setForm,
    form,

    deleted,
    handlePostLike,
    handlePostSave,

    user,

    editPostId,
    setEditPostId,
  };
}