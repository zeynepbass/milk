import apiClient from "@/shared/api";

export const userLoginService = {
  postService: async (formData) => {
    const { data } = await apiClient.post("/users/login", formData);

    return data;
  },
};

export const userRegisterService = {
  postService: async (formData) => {
    const { data } = await apiClient.post("/users/register", formData);

    return data;
  },
};

export const userProfile = {
  getService: async (token) => {
    const { data } = await apiClient.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },
};

export const userProfileUpdated = {
  postService: async (formData, token) => {
    const { data } = await apiClient.put("/users/updateUser", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },
};

export const userProfilFreeze = {
  freezeServices: async (token) => {
    const { data } = await apiClient.put(
      "/users/freeze",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  },
};

export const userProfileDeleted = {
  deletedServices: async (token, id) => {
    const { data } = await apiClient.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },
};