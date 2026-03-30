import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";
import useUserLogin from "@/features/hooks/user/useUser";
import { useState } from "react";

export function Register() {
  const { handleSubmitRegister, loading } = useUserLogin();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    role: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmitRegister(formData);
  };

  return (
    <div className="flex h-screen">

      <div className="hidden md:block md:w-1/2 relative">
        <img
          src="/images/wallpaper.png"
          alt="Milk Wallpaper"
          className="h-full w-full object-cover"
        />


        <div className="absolute inset-0 bg-black/30" />


        <div className="absolute bottom-6 left-6">
          <img
            src="/images/footer-logo.png"
            width="120"
            height="60"
            alt="Milk logo"
          />
        </div>
      </div>


      <div className="flex w-full md:w-1/2 justify-center items-center bg-white px-6">
        <form
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
          onSubmit={onSubmit}
        >
    
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-[rgb(71,92,120)]">
              Kayıt Ol
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Hesabınızı oluşturmak için bilgilerinizi giriniz.
            </p>
          </div>


          <div className="space-y-5">

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm text-gray-500 pb-2">
                  Ad
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  placeholder="Adınız"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)] transition"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm text-gray-500 pb-2">
                  Soyad
                </label>
                <input
                  type="text"
                  name="surname"
                  onChange={handleChange}
                  placeholder="Soyadınız"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)] transition"
                />
              </div>
            </div>


            <div>
              <label className="block text-sm text-gray-500 pb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="ornek@mail.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)] transition"
              />
            </div>

 
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm text-gray-500 pb-2">
                  Parola
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)] transition"
                />
              </div>

              <div className="flex-1 relative">
                <label className="block text-sm text-gray-500 pb-2">
                  Üye Alanı
                </label>
                <select
                  name="role"
                  onChange={handleChange}
                  className="w-full appearance-none rounded-lg border border-gray-200
                  px-4 py-2 text-sm text-gray-500 focus:outline-none
                  focus:ring-2 focus:ring-[rgb(82,144,246)] transition"
                >
                  <option value="" disabled>
                    Rol seçiniz
                  </option>
                  <option value="satici">Satıcı</option>
                  <option value="alici">Alıcı</option>
                </select>

                <ChevronDownIcon className="pointer-events-none absolute right-3 top-9 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>


          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white transition shadow-md
            ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[rgb(82,144,246)] hover:bg-[rgb(60,120,220)]"
            }`}
          >
            {loading ? "Gönderiliyor..." : "Üye Ol"}
          </button>


          <p className="mt-6 flex items-center gap-3 text-sm text-gray-400">
            <span className="flex-1 h-px bg-gray-200" />

            <span className="whitespace-nowrap">
              Üye misin?{" "}
              <Link
                to="/giris-yap"
                className="text-[rgb(82,144,246)] font-semibold hover:underline"
              >
                Giriş yap
              </Link>
            </span>

            <span className="flex-1 h-px bg-gray-200" />
          </p>
        </form>
      </div>
    </div>
  );
}