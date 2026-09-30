import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { postService } from "../services/post.service";

const likePost = async (id) => {
  try {
    return await postService.likePost(id);
  } catch (error) {
    toast.error(getErrorMessage(error, "Beğeni işlemi başarısız oldu."));
    return null;
  }
};

const savePost = async (id) => {
  try {
    return await postService.savePost(id);
  } catch (error) {
    toast.error(getErrorMessage(error, "Kaydetme işlemi başarısız oldu."));
    return null;
  }
};

const deletePost = async (id) => {
  try {
    await postService.deletePost(id);
    return true;
  } catch (error) {
    toast.error(getErrorMessage(error, "Gönderi silinirken bir hata oluştu."));
    return false;
  }
};

const updatePost = async (id, formData) => {
  try {
    const result = await postService.updatePost(id, formData);
    toast.info(result.message || "Gönderi başarıyla güncellendi");
    return result.post;
  } catch (error) {
    toast.error(getErrorMessage(error, "Gönderi güncellenirken bir hata oluştu."));
    return null;
  }
};

const postActions = { likePost, savePost, deletePost, updatePost };

export function usePostActions() {
  return postActions;
}

export const toggleSavedBy = (post, userId) => {
  const savedBy = Array.isArray(post.savedBy) ? post.savedBy : [];
  const matches = (saved) => saved === userId || saved?._id === userId;

  return {
    ...post,
    savedBy: savedBy.some(matches) ? savedBy.filter((saved) => !matches(saved)) : [...savedBy, userId],
  };
};
