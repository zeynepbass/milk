import { Link } from "react-router-dom";
import useUserLogin from "@/features/hooks/user/useUser";
import { useState } from "react";

export function Login() {
  const { handleSubmit } = useUserLogin();

  const [formData, setFormData] = useState({
    email: "",
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
    handleSubmit(formData);
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
              Giriş Yap
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Seni tekrar görmek güzel! Devam etmek için giriş yap.
            </p>
          </div>


          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500 pb-2">
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

            <div>
              <label className="block text-sm font-medium text-gray-500 pb-2">
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
          </div>


          <button
            type="submit"
            className="mt-6 w-full rounded-lg py-3 text-white font-semibold 
            bg-[rgb(82,144,246)] hover:bg-[rgb(60,120,220)] transition shadow-md"
          >
            Giriş Yap
          </button>

  
          <p className="mt-6 flex items-center gap-3 text-sm text-gray-400">
            <span className="flex-1 h-px bg-gray-200" />

            <span className="whitespace-nowrap">
              Üye değil misin?{" "}
              <Link
                to="/uye-ol"
                className="text-[rgb(82,144,246)] font-semibold hover:underline"
              >
                Üye ol
              </Link>
            </span>

            <span className="flex-1 h-px bg-gray-200" />
          </p>
        </form>
      </div>
    </div>
  );
}