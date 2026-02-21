
import { Link } from "react-router-dom";
import useUserLogin from "../../../hooks/user/useUser"
import { useState } from "react";
export function Login() {
  const {handleSubmit}=useUserLogin()
  const [formData,setFormData]=useState({
    email:"",
    password:""
  })
  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    })
  }
  const onSubmit = (e) => {
    console.log(formData)
    e.preventDefault();
    handleSubmit(formData);
  };
  //login arka planı değiştirildi
  return( 
    <div
      className="hidden md:block relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/wallpaper.png')" }}
    >

      <div className="absolute top-[40%] right-[14%] -translate-y-1/2">
      <form className="w-[420px] rounded-xl  backdrop-blur-md p-8 shadow-xl" onSubmit={onSubmit}>

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
                name="email"
                onChange={handleChange}
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
            className="mt-6 w-full rounded-md  py-2.5
            text-sm font-semibold text-white bg-[rgb(137,205,251)]
hover:bg-gray-200  transition"
          >
            Giriş Yap
          </button>


          <p className="mt-4 text-sm text-gray-500 text-center">
            Üye değil misin?{" "}
            <Link
              to="/uye-ol"
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
