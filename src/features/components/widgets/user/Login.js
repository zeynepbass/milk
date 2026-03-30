import { Link } from "react-router-dom";
import useUserLogin from "@/features/hooks/user/useUser";
import {useState } from "react";

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
    console.log(formData);
    handleSubmit(formData);

  };

  return (
    <div className="flex h-screen">

      <div className="relative w-2/3 hidden md:block">
        <img
          src="/images/wallpaper.png"
          alt="Milk Wallpaper"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 text-white text-sm font-semibold">
        <img      src="/images/footer-logo.png"
        width="120"
        height="60"
          alt="Milk logo"/>  
        </div>
      </div>


      <div className="flex w-full md:w-2/3 justify-center items-center  bg-white">
        <form
          className="w-full max-w-md "
          onSubmit={onSubmit}
        >
          <div className=" pb-4 mb-6">
            <h1 className="text-4xl font-semibold text-[rgb(71,92,120)]">
              Giriş Yap
            </h1>
            <p className="mt-1 text-md text-gray-600">
              Seni tekrar görmek güzel! Devam etmek için giriş yap.
            </p>
          </div>

          <div className="space-y-4">
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

            <div>
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
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-md py-3 text-md font-semibold text-white bg-[rgb(137,205,251)]
hover:bg-gray-200 transition"
          >
            Giriş Yap
          </button>

          <p className="mt-4 text-sm text-gray-500 text-center">
            Üye değil misin?{" "}
            <Link
              to="/uye-ol"
              className="text-[rgb(82,144,246)] font-semibold hover:underline"
            >
              Üye ol
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}