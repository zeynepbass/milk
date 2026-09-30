export function AuthLayout({ children }) {
  return (
    <main className="min-h-screen flex bg-gray-50">
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img
          src="/assets/wallpaper.jpg"
          alt=""
          loading="lazy"
          width="1600"
          height="1066"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-10 left-10 right-10 z-10 text-white">
          <img
            src="/assets/footer-logo-sm.png"
            width="80"
            height="40"
            alt="Milk"
            className="object-contain"
          />
          <h2 className="text-3xl lg:text-4xl font-semibold leading-tight pt-4">
            Yerel üreticiyle
            <br />
            doğrudan buluşun.
          </h2>
          <p className="mt-4 max-w-md text-sm lg:text-base text-white/85 leading-relaxed">
            Süt, bal, zeytinyağı ve daha fazlasını üreticisinden takip edin, beğenin ve mesajlaşın.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 md:hidden">
            <img
              src="/assets/footer-logo-sm.png"
              width="120"
              height="60"
              alt="Milk"
              className="object-contain"
            />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
