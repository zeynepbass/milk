import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heading } from "@/shared/components/atoms";
import { EmptyState, QueryState } from "@/shared/components/molecules";
import { POST_CATEGORY_OPTIONS } from "@/shared/validation/labels";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { usePost } from "../../hooks/usePostQueries";
import { ImageCarousel } from "../ImageCarousel";
import { PostCardHeader } from "../PostCardHeader";
import { PostActions } from "../PostActions";
import { CommentsPanel } from "../CommentsPanel";
import { EditPostModal } from "../EditPostModal";

const categoryLabel = (value) => POST_CATEGORY_OPTIONS.find((option) => option.value === value)?.label ?? value;

function Tag({ children }) {
  return <span className="px-4 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-full text-sm">{children}</span>;
}

export function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserId = useAuthStore((state) => state.userId);
  const query = usePost(id);
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const post = query.data;

  return (
    <QueryState
      query={query}
      isEmpty={!post}
      empty={<EmptyState title="Gönderi bulunamadı" description="Bu gönderi kaldırılmış olabilir." />}
    >
      {post && (
        <article className="max-w-5xl mx-auto p-6 dark:bg-gray-800 rounded-lg m-2 space-y-6">
          <ImageCarousel images={post.images ?? []} title={post.title} />
          <PostCardHeader post={post} />

          <Heading title={post.title} desc={post.description} className="text-3xl font-bold" />

          <div className="flex flex-wrap gap-3">
            {post.category && <Tag>{categoryLabel(post.category)}</Tag>}
            {post.province && <Tag>{post.province}</Tag>}
            {post.district && <Tag>{post.district}</Tag>}
          </div>

          <PostActions
            post={post}
            isOwner={post.user?._id === currentUserId}
            commentsOpen={commentsOpen}
            onToggleComments={() => setCommentsOpen((open) => !open)}
            onEdit={() => setEditing(true)}
            onDeleted={() => navigate("/", { replace: true })}
          />

          {commentsOpen && <CommentsPanel postId={post._id} />}
          {editing && <EditPostModal post={post} onClose={() => setEditing(false)} />}
        </article>
      )}
    </QueryState>
  );
}
