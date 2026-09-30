import { Link } from "react-router-dom";
import { Avatar } from "@/shared/components/atoms";
import { ROLE_LABELS } from "@/shared/validation/labels";

export function PostCardHeader({ post }) {
  const author = post.user ?? {};

  return (
    <div className="flex items-center gap-3">
      <Avatar user={author} showBadge />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
            {author.name} {author.surname}
          </p>
          <span className="text-xs text-blue-700 dark:text-yellow-400">{ROLE_LABELS[author.role]}</span>
        </div>

        <Link
          to={`/urun/${post._id}`}
          className="block text-sm text-gray-500 dark:text-gray-400 mt-1 truncate hover:underline focus-visible:underline"
        >
          {post.title}
        </Link>
      </div>
    </div>
  );
}
