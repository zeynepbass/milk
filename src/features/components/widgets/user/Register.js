import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";
import useUserLogin from "../../../hooks/user/useUser";
import { useState } from "react";
export function Register() {
  //? uı düzenlenicek
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
    console.log(formData);
    e.preventDefault();
    handleSubmitRegister(formData);
  };
  return (
    <div className="flex h-screen">
      <div className="relative w-2/3 hidden md:block">
        <img
          src="/images/wallpaper-login.png"
          alt="Milk Wallpaper"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 text-white text-sm font-semibold">
          <img
            src="/images/footer-logo.png"
            width="120"
            height="60"
            alt="Milk logo"
          />
        </div>
      </div>

      <div className="flex w-full md:w-2/3 justify-center items-center  bg-white">
        <form className="w-full max-w-md " onSubmit={onSubmit}>
          {" "}
          <div className=" pb-4 mb-6">
            <h1 className="text-4xl font-semibold text-[rgb(71,92,120)]">
              Kayıt Ol
            </h1>
            <p className="mt-1 text-md text-gray-600">
              Hesabınızı oluşturmak için bilgilerinizi giriniz.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center col-span-2 gap-1">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 pb-2">
                  Ad
                </label>
                <input
                  type="text"
                  placeholder="Adınız"
                  name="name"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)]"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 pb-2">
                  Soyad
                </label>
                <input
                  type="text"
                  name="surname"
                  onChange={handleChange}
                  placeholder="Soyadınız"
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 pb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="ornek@mail.com"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)]"
              />
            </div>
            <div className="flex justify-between items-center col-span-2 gap-1">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 pb-2">
                  Parola
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)]"
                />
              </div>

              <div className="flex-1 relative">
                <label className="block text-sm font-medium text-gray-400 pb-2">
                  Üye Alanı
                </label>
                <select
                  name="role"
                  onChange={handleChange}
                  className="mt-1 w-full appearance-none rounded-md border border-gray-200
      px-3 py-2 text-sm text-gray-500 focus:outline-none
      focus:ring-2 focus:ring-[rgb(82,144,246)]"
                >
                  <option value="" disabled>
                    Rol seçiniz
                  </option>
                  <option value="satici">satıcı</option>
                  <option value="alici">alıcı</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-9 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full rounded-md py-2.5 text-sm font-semibold text-white transition
    ${
      loading
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-[rgb(137,205,251)] hover:bg-gray-200"
    }
  `}
          >
            {loading ? "Gönderiliyor..." : "Üye Ol"}
          </button>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Üye misin?{" "}
            <Link
              to="/giris-yap"
              className="text-[rgb(82,144,246)] font-semibold hover:underline"
            >
              Giriş yap
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
