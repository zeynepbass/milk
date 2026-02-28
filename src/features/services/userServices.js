import { API_URI } from "../../constant/api";
import { postService } from "./postServices";

export const userLoginService= {

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
}

export const userRegisterService = {
  postService: async (formData) => {
    const res = await fetch(`${API_URI}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error("API error");
    return res.json();
  },
};

export const userProfile = {
  getService: async (token) => {
    const res = await fetch(`${API_URI}/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("API error");
    return res.json();
  },
};

export const userProfileUpdated={

  postService: async (formData, token) => {
    console.log("Gelen token:", token);
  
    const res = await fetch(`${API_URI}/users/updateUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
  
    if (!res.ok) throw new Error("API error");
    return res.json();
  }
  
}

