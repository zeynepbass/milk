import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { toAssetUrl } from "@/shared/config/env";

const SIZES = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-24 h-24 text-2xl",
};

const initialsOf = (user) =>
  [user?.name?.[0], user?.surname?.[0]].filter(Boolean).join("").toUpperCase() || "?";

export function Avatar({ user, size = "md", showBadge = false }) {
  const source = toAssetUrl(user?.avatar);
  const label = [user?.name, user?.surname].filter(Boolean).join(" ") || "Kullanıcı";

  return (
    <span className={`relative inline-flex shrink-0 ${SIZES[size]}`}>
      {source ? (
        <img
          src={source}
          alt={label}
          loading="lazy"
          className="w-full h-full rounded-full object-cover shadow"
        />
      ) : (
        <span
          role="img"
          aria-label={label}
          className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-semibold flex items-center justify-center"
        >
          {initialsOf(user)}
        </span>
      )}

      {showBadge && user?.dogrulanmisSatici && (
        <CheckBadgeIcon
          className="w-4 h-4 text-blue-500 absolute -top-1 -right-1 bg-white rounded-full"
          aria-label="Doğrulanmış satıcı"
        />
      )}
    </span>
  );
}
