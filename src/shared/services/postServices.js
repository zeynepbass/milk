import { API_BASE_URL } from "@/shared/constant/api";

export const postService = {
  getPosts: async ({ search, token }) => {
    try {
      let url = `${API_BASE_URL}/posts`;
  
      if (search?.trim()) {
        url += `?title=${encodeURIComponent(search.trim())}`;
      }
  
      const res = await fetch(url, {
        method: "GET",
        headers: {

          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error("API error");
  
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  getFollowingPosts: async ({ search, token }) => {
    try {
      let url = `${API_BASE_URL}/posts/following`;
      if (search?.trim()) {
        url += `?title=${encodeURIComponent(search.trim())}`;
      }
  
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      
      });
  
      if (!res.ok) throw new Error("API error");
  
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  onSubmit: async (formData, token) => {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // ✅
    });
  
    if (!res.ok) throw new Error("API error");
  
    return await res.json();
  },
  postDetails: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return await res.json();
  },
  postsavedBy: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return await res.json();
  },
  postLike: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}/like/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return await res.json();
  },
getSavedPosts:async (token) => {
    const res = await fetch(`${API_BASE_URL}/posts/users/saved-posts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("API error");
    }

    return await res.json();
  },
  userPostMe: async (token) => {
    const res = await fetch(`${API_BASE_URL}/posts/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return await res.json();
  },
  deleted:async(id,token)=> {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return await res.json();
  },
  followById:async(id,token)=>{
    const res = await fetch(`${API_BASE_URL}/users/follow/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return await res.json();
  },
  updatePost: async (id, formData, token) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
  
    return res.json();
  },

  postMessage:async(userId,token)=>{
    const res = await fetch(`${API_BASE_URL}/conversations/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    return res.json();

  },
  postMessageGet:async(userId,selectedUser,token)=>{
    const res = await fetch(`${API_BASE_URL}/conversations/${userId}/${selectedUser._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    return res.json();

  },
  feedback:async(token,payload)=>{
    const res=await fetch(`${API_BASE_URL}/users/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  
    return res.json();
  },
  postMessageSend: async (body,token) => {
    const res = await fetch(`${API_BASE_URL}/messages/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  
    return res.json();
  },

  notifications:async(token)=>{
    const res=await fetch(`${API_BASE_URL}/posts/notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
  
    return res.json();
  },

  markAsRead:async(id,token)=>{
    const res=await fetch(`${API_BASE_URL}/posts/markAsRead/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
  
    return res.json();
  }

};
