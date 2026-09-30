import { useState } from "react";
import { toAssetUrl } from "@/shared/config/env";
import { PostCardHeader } from "../PostCardHeader";
import { PostDescription } from "../PostDescription";
import { PostActions } from "../PostActions";
import { CommentsPanel } from "../CommentsPanel";
import { EditPostModal } from "../EditPostModal";

export function PostCard({ post, currentUserId }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const isOwner = post.user?._id === currentUserId;
  const [cover] = post.images ?? [];

  return (
    <article className="flex flex-col bg-white dark:bg-gray-800 shadow-md mt-4 rounded-xl overflow-hidden">
      {cover && (
        <img src={toAssetUrl(cover)} alt={post.title} loading="lazy" className="w-full h-48 object-cover" />
      )}

      <div className="p-5">
        <PostCardHeader post={post} />
        <div className="mt-3">
          <PostDescription text={post.description} maxLength={150} />
        </div>

        <PostActions
          post={post}
          isOwner={isOwner}
          commentsOpen={commentsOpen}
          onToggleComments={() => setCommentsOpen((open) => !open)}
          onEdit={() => setEditing(true)}
        />
      </div>

      {commentsOpen && <CommentsPanel postId={post._id} />}

      {editing && <EditPostModal post={post} onClose={() => setEditing(false)} />}
    </article>
  );
}
