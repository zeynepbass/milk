import { API_URI } from "constant/api";

export const commentService = {


  postComment: async (id, text, token) => {
    const res = await fetch(`${API_URI}/comments/${id}`, {
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


  getComments: async (id,token) => {
    const res = await fetch(`${API_URI}/comments/${id}`, {
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

  deleteComment:async(id,token)=>{
    const res = await fetch(`${API_URI}/comments/${id}`, {
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
likeComment:async(id,token)=>{
  const res = await fetch(`${API_URI}/comments/${id}/like`, {
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
