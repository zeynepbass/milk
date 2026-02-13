import { useEffect, useState } from "react";
import { postService } from "services/postServices";
import { useUserStore } from "../../store";
export default function usePost() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await postService.getPosts();

        setData(res);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return { data, loading,user };
}
