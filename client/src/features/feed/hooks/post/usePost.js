import { useEffect, useState } from "react";
import { useSearchStore } from "@/shared/store/useSearchStore";
import { useUserStore } from "@/shared/store/useUserStore";
import { postProvider } from "@/providers/post.provider";
import { toast } from "react-toastify";
export default function usePost() {
  const [openList, setOpenList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [favoruite, setfavoruite] = useState([]);
  const [open, setOpen] = useState(false);

  const search = useSearchStore((state) => state.search);
  const user = useUserStore((state) => state.user);

  const service = postProvider.service;

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

  const handlePostLike = async (id) => {
    try {
      const res = await service.likePost(id);

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

      const res = await service.getSavedPosts();

      setfavoruite(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSave = async (id) => {
    try {
      const res = await service.savePost(id);

      setData((prev) =>
        prev.map((post) => {
          if (post._id !== id) return post;

          const alreadySaved =
            Array.isArray(post.savedBy) &&
            post.savedBy.includes(user.id);

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
  
      const updatedPost = await service.updatePost(id, formData);
  
      setData((prev) =>
        prev.map((post) =>
          post._id === id ? updatedPost : post
        )
      );
  
      toast.info(updatedPost.message || "Gönderi başarıyla güncellendi.");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Gönderi güncellenirken bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  const followId = async (id) => {
    try {
      await service.followUser(id);

      setRefresh((prev) => !prev);
      setOpenList(false);
    } catch (error) {
      console.log(error);
    }
  };

  const NotificationAlerts = async () => {
    try {
      setLoading(true);

      const res = await service.getNotifications();

      setNotifications([...res].reverse());
    } catch (error) {
      console.log("Notification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await service.markAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return {
    data,
    loading,
    user,

    markAsRead,
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

    NotificationAlerts,
    notifications,
  };
}