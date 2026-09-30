import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/shared/components/atoms";
import { PostList } from "@/features/posts/components/PostList";
import { CreatePostModal } from "@/features/posts/components/CreatePostModal";
import { usePostFeed } from "@/features/posts/hooks/usePostQueries";

export function MyPostsPanel({ canPost }) {
  const [creating, setCreating] = useState(false);
  const query = usePostFeed("mine");

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border dark:bg-gray-800 dark:border-gray-700 border-gray-100">
      {canPost && (
        <div className="flex justify-end">
          <Button type="button" variant="primary" icon={PlusIcon} onClick={() => setCreating(true)}>
            Gönderi paylaş
          </Button>
        </div>
      )}

      <PostList
        query={query}
        emptyTitle="Gönderi Bulunamadı"
        emptyDescription={
          canPost ? "İlk gönderiyi sen oluşturabilirsin." : "Alıcı hesapları gönderi paylaşamaz."
        }
      />

      <CreatePostModal open={creating} onClose={() => setCreating(false)} />
    </div>
  );
}
