import { Modal } from "@/shared/components/molecules";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useCreatePost } from "../../hooks/usePostEditor";
import { PostForm } from "../PostForm";

export function CreatePostModal({ open, onClose }) {
  const { data: me } = useCurrentUser();
  const createPost = useCreatePost();

  const handleSubmit = (input) => createPost.mutate(input, { onSuccess: onClose });

  return (
    <Modal open={open} onClose={onClose} title="Yeni Gönderi Oluştur" size="lg">
      <PostForm
        fallbackLocation={me}
        submitLabel="Paylaş"
        pending={createPost.isPending}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}
