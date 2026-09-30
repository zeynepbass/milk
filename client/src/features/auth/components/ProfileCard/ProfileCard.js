import { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@/shared/components/atoms";
import { ROLE_LABELS } from "@/shared/validation/labels";
import { FollowListModal } from "@/features/users/components/FollowListModal";
import { useUpdateAvatar } from "../../hooks/useAccountMutations";
import { ProfileEditForm } from "../ProfileEditForm";

function CountButton({ count, label, onClick }) {
  return (
    <button type="button" onClick={onClick} className="text-center hover:underline">
      <span className="block font-semibold dark:text-gray-200">{count ?? 0}</span>
      <span className="block text-gray-500 dark:text-gray-400">{label}</span>
    </button>
  );
}

export function ProfileCard({ user }) {
  const [editing, setEditing] = useState(false);
  const [relation, setRelation] = useState(null);
  const updateAvatar = useUpdateAvatar();

  const handleAvatar = (event) => {
    const file = event.target.files?.[0];
    if (file) updateAvatar.mutate(file);
    event.target.value = "";
  };

  return (
    <section
      aria-label="Profil"
      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-md p-6 relative"
    >
      <button
        type="button"
        onClick={() => setEditing((value) => !value)}
        aria-label={editing ? "Düzenlemeyi kapat" : "Profili düzenle"}
        aria-expanded={editing}
        className="absolute top-4 right-4 rounded-full bg-gray-100 dark:bg-yellow-400 p-2 text-gray-600 dark:text-gray-900"
      >
        <PencilIcon className="w-4 h-4" aria-hidden="true" />
      </button>

      <div className="flex flex-col items-center">
        <label className="relative cursor-pointer group rounded-full focus-within:ring-2 focus-within:ring-blue-500">
          <Avatar user={user} size="lg" showBadge />
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 text-white text-xs">
            Değiştir
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-label="Profil fotoğrafı yükle"
            onChange={handleAvatar}
          />
        </label>

        <h2 className="font-semibold text-lg mt-4 dark:text-gray-200">
          {user.name} {user.surname}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{ROLE_LABELS[user.role]}</p>
        {(user.province || user.district) && (
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            {[user.district, user.province].filter(Boolean).join(", ")}
          </p>
        )}
      </div>

      <div className="flex justify-center gap-8 my-4 text-sm border-t dark:border-gray-700 pt-4">
        <CountButton count={user.followingCount} label="Takip" onClick={() => setRelation("following")} />
        <CountButton count={user.followersCount} label="Takipçi" onClick={() => setRelation("followers")} />
      </div>

      {editing && <ProfileEditForm user={user} onDone={() => setEditing(false)} />}

      {relation && <FollowListModal userId={user._id} relation={relation} onClose={() => setRelation(null)} />}
    </section>
  );
}
