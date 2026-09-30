import { Modal } from "@/shared/components/molecules";
import { useUpdatePost } from "../../hooks/usePostEditor";
import { PostForm } from "../PostForm";

export function EditPostModal({ post, onClose }) {
  const updatePost = useUpdatePost();

  const handleSubmit = (input) => updatePost.mutate({ postId: post._id, ...input }, { onSuccess: onClose });

  return (
    <Modal open onClose={onClose} title="Gönderiyi Düzenle" size="lg">
      <PostForm post={post} submitLabel="Güncelle" pending={updatePost.isPending} onSubmit={handleSubmit} />
    </Modal>
  );
}
