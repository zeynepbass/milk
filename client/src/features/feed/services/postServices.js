import apiClient from "@/shared/api";

export const postService = {
  getPosts: async ({ search, token }) => {
    const { data } = await apiClient.get("/posts", {
      params: search?.trim()
        ? { title: search.trim() }
        : undefined,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  getFollowingPosts: async ({ search, token }) => {
    const { data } = await apiClient.get("/posts/following", {
      params: search?.trim()
        ? { title: search.trim() }
        : undefined,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  onSubmit: async (formData, token) => {
    const { data } = await apiClient.post("/posts", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  postDetails: async (id, token) => {
    const { data } = await apiClient.get(`/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  postsavedBy: async (id, token) => {
    const { data } = await apiClient.post(
      `/posts/${id}/save`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  },

  postLike: async (id, token) => {
    const { data } = await apiClient.post(
      `/posts/${id}/like/post`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  },

  getSavedPosts: async (token) => {
    const { data } = await apiClient.get("/posts/users/saved-posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  userPostMe: async (token) => {
    const { data } = await apiClient.get("/posts/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  deleted: async (id, token) => {
    const { data } = await apiClient.delete(`/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  followById: async (id, token) => {
    const { data } = await apiClient.post(
      `/users/follow/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  },

  updatePost: async (id, formData, token) => {
    const { data } = await apiClient.put(
      `/posts/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  },

  postMessage: async (userId, token) => {
    const { data } = await apiClient.get(`/conversations/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  postMessageGet: async (userId, selectedUser, token) => {
    const { data } = await apiClient.get(
      `/conversations/${userId}/${selectedUser._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  },

  feedback: async (token, payload) => {
    const { data } = await apiClient.post(
      "/users/feedback",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  },

  postMessageSend: async (body, token) => {
    const { data } = await apiClient.post(
      "/messages/send",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  },

  notifications: async (token) => {
    const { data } = await apiClient.get(
      "/posts/notifications",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  },

  markAsRead: async (id, token) => {
    const { data } = await apiClient.put(
      `/posts/markAsRead/${id}`,
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