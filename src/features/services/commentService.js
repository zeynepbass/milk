import { API_URI } from "constant/api";

export const commentService = {


  postComment: async (postId, text, token) => {
    const res = await fetch(`${API_URI}/comments/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error("Comment eklenemedi");
    }

    return await res.json();
  },


  getComments: async (postId,token) => {
    const res = await fetch(`${API_URI}/comments/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
    if (!res.ok) {
      throw new Error("Yorumlar alınamadı");
    }

    return await res.json();
  },

  deleteComment:async(postId,token)=>{
    const res = await fetch(`${API_URI}/comments/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
  if (!res.ok) {
    throw new Error("Yorumlar alınamadı");
  }

  return await res.json();
},
likeComment:async(postId,token)=>{
  const res = await fetch(`${API_URI}/comments/${postId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
if (!res.ok) {
  throw new Error("Yorumlar alınamadı");
}

return await res.json();
},
};
