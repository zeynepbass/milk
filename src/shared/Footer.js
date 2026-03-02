export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl px-6 py-6 flex items-center gap-2 text-sm text-[rgb(71,92,120)]">
        <span>©{new Date().getFullYear()} | Keyifle kodlanmıştır.</span>
        <video
          src="/images/milk.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="w-7 h-7 object-cover"
        />
      </div>
    </footer>
  );
}