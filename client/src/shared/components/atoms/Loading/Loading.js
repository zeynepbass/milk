export function Loading({ loading = true }) {
  if (!loading) return null;

  return (
    <div role="status" className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
      Yükleniyor...
    </div>
  );
}
