import { API_BASE_URL } from "@/shared/constant/api";
export const userLoginService = {
  postService: async (formData) => {
    const res = await fetch(`${API_BASE_URL}/users/login`, {
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

export const userRegisterService = {
  postService: async (formData) => {
    const res = await fetch(`${API_BASE_URL}/users/register`, {
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
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
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

export const userProfileUpdated = {
  postService: async (formData, token) => {
    const res = await fetch(`${API_BASE_URL}/users/updateUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("API error");
    return res.json();
  },
};
export const userProfilFreeze = {
  freezeServices: async (token) => {
    const res = await fetch(`${API_BASE_URL}/users/freeze`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("API error");
    return res.json();
  },
};

export const userProfileDeleted={
  deletedServices:async(token,id)=> {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("API error");
    return res.json();
  },

}