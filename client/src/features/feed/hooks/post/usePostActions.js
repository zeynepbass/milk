import { useState } from "react";
import { postProvider } from "@/providers/post.provider";
import { toast } from "react-toastify";

export default function usePostActions() {
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const service = postProvider.service;

  const likePost = async (id) => {
    try {
      return await service.likePost(id);
    } catch (error) {
      toast.error("Beğeni işlemi başarısız oldu.");
      return null;
    }
  };

  const savePost = async (id) => {
    try {
      return await service.savePost(id);
    } catch (error) {
      toast.error("Kaydetme işlemi başarısız oldu.");
      return null;
    }
  };

  const deletePost = async (id) => {
    try {
      await service.deletePost(id);
      return true;
    } catch (error) {
      toast.error("Gönderi silinirken bir hata oluştu.");
      return false;
    }
  };

  const updatePost = async (id, formData) => {
    try {
      const res = await service.updatePost(id, formData);
      toast.info(res.message || "Gönderi başarıyla güncellendi");
      return res.post;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Gönderi güncellenirken bir hata oluştu."
      );
      return null;
    }
  };

  const sendFeedback = async (payload) => {
    try {
      setFeedbackLoading(true);

      const res = await service.sendFeedback(payload);

      toast.info(res.message || "Başarılı");
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Geri bildirim gönderilemedi."
      );
      return false;
    } finally {
      setFeedbackLoading(false);
    }
  };

  return {
    likePost,
    savePost,
    deletePost,
    updatePost,
    sendFeedback,
    feedbackLoading,
  };
}
