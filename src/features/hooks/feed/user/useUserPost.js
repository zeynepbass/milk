import { useEffect, useState } from "react";
import { postService } from "features/services/postServices";
import { useUserStore } from "../../../../store";
export default function usePostDetail() {
  const [details, setDetails] = useState([]);
      const [button,setButton]=useState(false)
    const handleUpdated=()=>{
      console.log(button)
      setButton(true)
    }
  const user = useUserStore((state) => state.user);

  const token = useUserStore((state) => state.token);
  const [form, setForm] = useState({
    ownerName: "",
    ownerSurname: "",
    ownerRole: "alici",
    title: "",
    description: "",
    district: "",
    category: "sut_urunleri",
    images: [],
  });
  const [loading, setLoading] = useState(false);

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
  const onSubmit = async () => {
    try {
      setLoading(true);
      const res = await postService.onSubmit(form,token);
      setDetails((prev) => [...prev, res]);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const deleted=async (postId) => {
      try {
        await postService.deleted(postId, token);
  
        setDetails((prev) => prev.filter((item) => item._id !== postId));
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
    
    const handlePostSave = async (id) => {
      try {
        const res = await postService.postsavedBy(id, token);
    
        setDetails((prev) =>
          prev.map((post) => {
            if (post._id !== id) return post;
    
            const alreadySaved = post.savedBy.includes(user.id);
    
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


  return { details, loading,onSubmit,setForm,form,deleted,handlePostLike,handlePostSave,user,handleUpdated,button,setButton};
}
