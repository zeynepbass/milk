import { useEffect, useState } from "react";
import { postService } from "services/postServices";
import { useUserStore } from "../../../store";
export default function usePostDetail() {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = useUserStore((state) => state.token);
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

  return { details, loading };
}
