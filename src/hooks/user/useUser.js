import { useState } from "react";
import userPostService from "../../services/userServices";
export default function userLogin() {
  const [data, setData] = useState(null);
  const handleSubmit = async (formData) => {
    try {
      const res = await userPostService.postService(formData);
      setData(res);
    } catch (error) {
      console.log(error);
    }
  };

  return { data, handleSubmit };
}
