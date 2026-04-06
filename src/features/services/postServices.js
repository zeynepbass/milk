import { API_URI } from "@/constant/api";

export const postService = {
  getPosts: async ({ search, token }) => {
    try {
      let url = `${API_URI}/posts`;
  
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
      let url = `${API_URI}/posts/following`;
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
    const res = await fetch(`${API_URI}/posts`, {
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
    const res = await fetch(`${API_URI}/posts/${id}`, {
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
    const res = await fetch(`${API_URI}/posts/${id}/save`, {
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
    const res = await fetch(`${API_URI}/posts/${id}/like/post`, {
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
    const res = await fetch(`${API_URI}/posts/users/saved-posts`, {
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
    const res = await fetch(`${API_URI}/posts/user/me`, {
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
    const res = await fetch(`${API_URI}/posts/${id}`, {
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
    const res = await fetch(`${API_URI}/users/follow/${id}`, {
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
    const res = await fetch(`${API_URI}/posts/${id}`, {
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
    const res = await fetch(`${API_URI}/conversations/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    return res.json();

  },
  postMessageGet:async(userId,selectedUser,token)=>{
    const res = await fetch(`${API_URI}/conversations/${userId}/${selectedUser._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    return res.json();

  },
  feedback:async(token,payload)=>{
    const res=await fetch(`${API_URI}/users/feedback`, {
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
    const res = await fetch(`${API_URI}/messages/send`, {
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
    const res=await fetch(`${API_URI}/posts/notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
  
    return res.json();
  },

  markAsRead:async(id,token)=>{
    const res=await fetch(`${API_URI}/posts/markAsRead/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
  
    return res.json();
  }

};
