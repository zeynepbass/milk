import { UserMinusIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useFollowToggle } from "../../hooks/useFollow";

export function FollowButton({ userId, following, userName, compact = false }) {
  const followToggle = useFollowToggle();
  const Icon = following ? UserMinusIcon : UserPlusIcon;
  const label = following
    ? `${userName ?? "Kullanıcıyı"} takipten çık`
    : `${userName ?? "Kullanıcıyı"} takip et`;

  return (
    <button
      type="button"
      aria-pressed={following}
      aria-label={label}
      disabled={followToggle.isPending}
      onClick={() => followToggle.mutate({ userId, following: !following })}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm transition ${
        following
          ? "text-green-600 dark:text-green-400"
          : "text-gray-500 dark:text-gray-400 hover:text-green-500"
      }`}
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
      {!compact && <span>{following ? "Takiptesin" : "Takip et"}</span>}
    </button>
  );
}
