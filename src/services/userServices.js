import { API_URI } from "constant/api";
export default function userLoginService() {
  return {
    postService: async (formData) => {
      const res = await fetch(`${API_URI}/users/login`, {
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
export default function userRegisterService() {
  return {
    postService: async (formData) => {
      const res = await fetch(`${API_URI}/users/register`, {
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
