import { XMarkIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@/shared/components/atoms";

export function CommentItem({ comment, isOwner, onLike, onDelete }) {
  return (
    <li className={`flex gap-3 ${comment.pending ? "opacity-60" : ""}`}>
      <Avatar user={comment.user} size="sm" />

      <div className="flex flex-col w-full min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {comment.user?.name} {comment.user?.surname}
          </p>

          {isOwner && !comment.pending && (
            <button
              type="button"
              onClick={onDelete}
              aria-label="Yorumu sil"
              className="p-1 text-gray-500 hover:text-red-500"
            >
              <XMarkIcon className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{comment.text}</p>

        <div className="flex items-center gap-4 mt-1">
          <button
            type="button"
            disabled={comment.pending}
            aria-pressed={Boolean(comment.likedByMe)}
            onClick={onLike}
            className="text-xs text-blue-600 dark:text-yellow-400 hover:underline"
          >
            {comment.likedByMe ? "Beğenmekten Vazgeç" : "Beğen"}
          </button>
          <span className="text-xs text-gray-500">{comment.likesCount ?? 0} beğeni</span>
        </div>
      </div>
    </li>
  );
}
