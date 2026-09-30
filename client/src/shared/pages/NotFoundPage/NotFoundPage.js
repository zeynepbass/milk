export function NotFoundPage() {
  return (
    <div
      role="img"
      aria-label="Sayfa bulunamadı"
      className="bg-cover bg-center h-screen w-full"
      style={{ backgroundImage: "url('/assets/notfound.png')" }}
    />
  );
}
