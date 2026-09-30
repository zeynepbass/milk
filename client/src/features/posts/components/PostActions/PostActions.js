import { useNavigate } from "react-router-dom";
import {
  BookmarkIcon,
  ChatBubbleBottomCenterIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon, HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { FollowButton } from "@/features/users/components/FollowButton";
import { usePostLike, usePostSave } from "../../hooks/usePostReactions";
import { useDeletePost } from "../../hooks/usePostEditor";

const ICON_BUTTON =
  "inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm text-gray-500 dark:text-gray-400 transition focus-visible:outline-2 focus-visible:outline-blue-500";

export function PostActions({ post, isOwner, commentsOpen, onToggleComments, onEdit, onDeleted }) {
  const navigate = useNavigate();
  const like = usePostLike();
  const save = usePostSave();
  const remove = useDeletePost();
  const author = post.user ?? {};
  const authorName = [author.name, author.surname].filter(Boolean).join(" ");

  const messageSeller = () =>
    navigate("/mesajlar", {
      state: { product: { productId: post._id, title: post.title, userId: author._id, userName: authorName } },
    });

  const handleDelete = () => {
    if (window.confirm("Gönderiyi kaldırmak istediğine emin misin?")) {
      remove.mutate(post._id, { onSuccess: onDeleted });
    }
  };

  const LikeIcon = post.likedByMe ? HeartSolidIcon : HeartIcon;
  const SaveIcon = post.savedByMe ? BookmarkSolidIcon : BookmarkIcon;

  return (
    <div className="flex justify-between items-center border-t dark:border-gray-700 mt-4 pt-2">
      <div className="flex items-center">
        <button
          type="button"
          className={`${ICON_BUTTON} hover:text-blue-500`}
          aria-expanded={commentsOpen}
          aria-label="Yorumlar"
          onClick={onToggleComments}
        >
          <ChatBubbleBottomCenterIcon className="w-5 h-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          className={`${ICON_BUTTON} hover:text-red-500 ${post.likedByMe ? "text-red-500 dark:text-red-400" : ""}`}
          aria-pressed={Boolean(post.likedByMe)}
          aria-label={post.likedByMe ? "Beğeniyi geri al" : "Beğen"}
          onClick={() => like.mutate({ postId: post._id, liked: !post.likedByMe })}
        >
          <LikeIcon className="w-5 h-5" aria-hidden="true" />
          <span>{post.likesCount ?? 0}</span>
        </button>

        {!isOwner && (
          <button
            type="button"
            className={`${ICON_BUTTON} hover:text-yellow-500 ${post.savedByMe ? "text-yellow-500" : ""}`}
            aria-pressed={Boolean(post.savedByMe)}
            aria-label={post.savedByMe ? "Kaydedilenlerden çıkar" : "Kaydet"}
            onClick={() => save.mutate({ postId: post._id, saved: !post.savedByMe })}
          >
            <SaveIcon className="w-5 h-5" aria-hidden="true" />
            <span>{post.savesCount ?? 0}</span>
          </button>
        )}
      </div>

      <div className="flex items-center">
        {!isOwner && author._id && (
          <>
            <FollowButton userId={author._id} following={Boolean(post.isFollowingAuthor)} userName={authorName} compact />
            <button
              type="button"
              className={`${ICON_BUTTON} hover:text-blue-500`}
              aria-label={`${authorName} ile mesajlaş`}
              onClick={messageSeller}
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </>
        )}

        {isOwner && (
          <>
            <button type="button" className={`${ICON_BUTTON} hover:text-yellow-500`} aria-label="Düzenle" onClick={onEdit}>
              <PencilIcon className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`${ICON_BUTTON} hover:text-red-500`}
              aria-label="Gönderiyi kaldır"
              disabled={remove.isPending}
              onClick={handleDelete}
            >
              <TrashIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
