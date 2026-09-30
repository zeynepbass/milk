import { useEffect, useMemo } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toAssetUrl } from "@/shared/config/env";
import { RULES } from "@/shared/validation/rules";

const fileKey = (file) => `${file.name}-${file.size}-${file.lastModified}`;

function Thumbnail({ src, alt, onRemove, removeLabel }) {
  return (
    <li className="relative group">
      <img src={src} alt={alt} loading="lazy" className="w-full h-24 object-cover rounded-lg border" />
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="absolute top-1 right-1 rounded-full bg-white/90 p-1 text-red-500 shadow focus-visible:outline-2"
      >
        <XMarkIcon className="w-4 h-4" aria-hidden="true" />
      </button>
    </li>
  );
}

export function ImagePicker({ existing = [], files, onFilesChange, onRemoveExisting }) {
  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);

  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)), [previews]);

  const remaining = RULES.postImages.max - existing.length - files.length;

  const handleSelect = (event) => {
    const selected = Array.from(event.target.files ?? []).slice(0, Math.max(remaining, 0));
    onFilesChange([...files, ...selected]);
    event.target.value = "";
  };

  return (
    <div className="space-y-3">
      {(existing.length > 0 || previews.length > 0) && (
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {existing.map((url) => (
            <Thumbnail
              key={url}
              src={toAssetUrl(url)}
              alt="Mevcut görsel"
              removeLabel="Mevcut görseli kaldır"
              onRemove={() => onRemoveExisting(url)}
            />
          ))}
          {previews.map(({ file, url }) => (
            <Thumbnail
              key={fileKey(file)}
              src={url}
              alt={file.name}
              removeLabel={`${file.name} görselini kaldır`}
              onRemove={() => onFilesChange(files.filter((item) => item !== file))}
            />
          ))}
        </ul>
      )}

      {remaining > 0 && (
        <label className="flex flex-col dark:bg-gray-900 items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-blue-400 transition bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleSelect}
            className="sr-only"
          />
          <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" aria-hidden="true" />
          <span className="text-sm text-gray-500">Görsel eklemek için tıklayın (en fazla {remaining} adet)</span>
        </label>
      )}
    </div>
  );
}
