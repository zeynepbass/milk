import { useEffect, useState } from "react";
import { postService } from "@/features/services/postServices";
import { useUserStore } from "@/store";
export default function usePostDetail() {
  const [details, setDetails] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const user = useUserStore((state) => state.user);
  const [loadingPost, setLoading] = useState(false);
  const token = useUserStore((state) => state.token);
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
    if (user) {
      setForm((prev) => ({
        ...prev,
        ownerName: user?.name,
        ownerSurname: user?.surname,
        ownerRole: user?.role,
        title: "",
        description: "",
        district: user?.district,
        province: user?.province,
        category: "",
        images: [],
      }));
    }
  }, [user]);


  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await postService.userPostMe(token);
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
  const [postLoading,setPostLoading]=useState(false)
  const onSubmit = async () => {
    try {
      setPostLoading(true);
      const res = await postService.onSubmit(form, token);
      setDetails((prev) => [res, ...prev]);

    } catch (error) {
      console.log(error);
    } finally {
      setPostLoading(false);
    }
  };

  const deleted = async (postId) => {
    console.log(postId);
    try {
      setDetails((prev) => prev.filter((item) => item._id !== postId));
      await postService.deleted(postId, token);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePostLike = async (id) => {
    try {
      const res = await postService.postLike(id, token);

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
  const [feedback,setFeeback]=useState(false)
  const onSubmitFeedback = async (payload) => {
    try {

      setFeeback(true); 
  
      await postService.feedback(token, payload);
  
    } catch (error) {
      console.log("Notification error:", error);
    } finally {
      setFeeback(false);
    }
  };
  const handlePostSave = async (id, token) => {
    try {
      await postService.postsavedBy(id, token);

      setDetails((prev) =>
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
    } catch (error) {
      console.log(error);
    }
  };

  return {
    details,
    feedback,
    onSubmitFeedback,
    onSubmit,
    postLoading,
    setForm,
    form,
    deleted,
    handlePostLike,
    handlePostSave,
    user,
    loadingPost,
    editPostId,
    setEditPostId,
  };
}
