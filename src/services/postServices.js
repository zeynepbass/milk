import { API_URI } from "constant/api";

export const postService = {
  getPosts: async () => {
    const res = await fetch(`${API_URI}/posts`, {
      method:"GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return await res.json();
  },
  postDetails:async(id,token)=>{
    const res=await fetch(`${API_URI}/posts/${id}`, {
      method:"GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return await res.json();
  },
  postsavedBy:async(id,token)=>{
    const res=await fetch(`${API_URI}/posts/${id}/save`, {
      method:"POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return await res.json();
  },
  postLike:async(id,token)=>{
    const res=await fetch(`${API_URI}/posts/${id}/like/post`, {
      method:"POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return await res.json();
  },
  userPostMe:async(token)=>{
    const res=await fetch(`${API_URI}/posts/user/me`, {
      method:"GET",
      headers:{
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`,
      }
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return await res.json();
  }}