import { useState } from "react";
import userPostService from "@/services/userServices";
import { useUserStore } from "@/store";
export default function userLogin() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await userPostService.postService(formData);
      setUser(res);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, error };
}
