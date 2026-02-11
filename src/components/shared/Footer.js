export function Footer() {
  return (
<footer className="">
  <div className=" max-w-7xl px-6 py-6 flex justify-start">
    <p className="flex items-center gap-2 text-sm text-[rgb(71,92,120)]">

    © {new Date().getFullYear()}     | Keyifle kodlanmıştır.<video
        src="/images/milk.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-7 h-7"
      />   
    </p>
  </div>
</footer>

  );
}
