export function EmptyState({
  title = "Gönderi Bulunamadı",
  description = "Henüz paylaşılmış bir gönderi yok",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-16 px-4">
      <img
        src="/assets/submission-error.png"
        alt=""
        loading="lazy"
        className="w-40 h-40 object-contain opacity-80 block dark:hidden"
      />
      <img
        src="/assets/dark-submission-error.png"
        alt=""
        loading="lazy"
        className="w-40 h-40 object-contain opacity-80 hidden dark:block"
      />

      <h2 className="text-lg font-semibold text-gray-700 mb-1 dark:text-gray-300">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm m-1">{description}</p>
      {action}
    </div>
  );
}
