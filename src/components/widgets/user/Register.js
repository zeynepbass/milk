import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";

export function Register() {
  return (
    <div
      className="hidden md:block relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/wallpaper.png')" }}
    >

      <div className="absolute top-1/2 right-[12%] -translate-y-1/2">
        <form className="w-[420px] rounded-xl  backdrop-blur-md p-8 shadow-xl">

          <div className="border-b border-gray-900/10 pb-4 mb-6">
            <h2 className="text-lg font-semibold text-[rgb(71,92,120)]">
              Kayıt Ol
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Hesabınızı oluşturmak için bilgilerinizi giriniz.
            </p>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Ad
              </label>
              <input
                type="text"
                placeholder="Adınız"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Soyad
              </label>
              <input
                type="text"
                placeholder="Soyadınız"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)]"
              />
            </div>

            <div className="sm:col-span-2">
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

            <div className="sm:col-span-2">
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

            <div className="sm:col-span-2 relative">
              <label className="block text-sm font-medium text-gray-500">
                Üye Alanı
              </label>
              <select
                className="mt-1 w-full appearance-none rounded-md border border-gray-200
                px-3 py-2 text-sm text-gray-500 focus:outline-none
                focus:ring-2 focus:ring-[rgb(82,144,246)]"
              >
                <option>Satıcı</option>
                <option>Alıcı</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-9 h-5 w-5 text-gray-400" />
            </div>
          </div>


          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-[rgb(82,144,246)]
            py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Üye Ol
          </button>


          <p className="mt-4 text-sm text-gray-500 text-center">
            Üye misin?{" "}
            <Link
              to="/giris-yap"
              className="text-[rgb(82,144,246)] font-medium hover:underline"
            >
              Giriş yap
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

