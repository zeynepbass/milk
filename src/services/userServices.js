import { API_URI } from "@/constant/api";
export default function userPostService() {
  return {
    postService: async (formData) => {
      const res = await fetch(`${API_URI}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error("API error");
      }
      return res.json();
    },
  };
}
