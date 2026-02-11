import { Link } from "react-router-dom";

export function Login() {
  return (
    <div
      className="hidden md:block relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/wallpaper.png')" }}
    >

      <div className="absolute top-[40%] right-[14%] -translate-y-1/2">
        <form className="w-[420px] rounded-xl backdrop-blur-md p-8 shadow-xl">

          <div className="border-b border-gray-900/10 pb-4 mb-6">
            <h2 className="text-lg font-semibold text-[rgb(71,92,120)]">
              Giriş Yap
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Seni tekrar görmek güzel! Devam etmek için giriş yap.
            </p>
          </div>


          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Email
              </label>
              <input
                type="email"
                placeholder="ornek@mail.com"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Parola
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)]"
              />
            </div>
          </div>


          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-[rgb(82,144,246)] py-2.5
            text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Giriş Yap
          </button>


          <p className="mt-4 text-sm text-gray-500 text-center">
            Üye değil misin?{" "}
            <Link
              to="/register"
              className="text-[rgb(82,144,246)] font-medium hover:underline"
            >
              Üye ol
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
