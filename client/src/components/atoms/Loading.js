export default function Loading({ loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        Yükleniyor...
      </div>
    );
  }
}
