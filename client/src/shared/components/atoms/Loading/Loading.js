export function Loading({ loading = true, label = "Yükleniyor..." }) {
  if (!loading) return null;

  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center h-[40vh] text-gray-400">
      <span
        className="w-8 h-8 mb-3 rounded-full border-4 border-gray-200 border-t-[rgb(82,144,246)] animate-spin"
        aria-hidden="true"
      />
      {label}
    </div>
  );
}
