import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";
import useUserLogin from "@/features/hooks/user/useUser";
import { useState } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
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
                <Input
                  label="Ad"
                  name="name"
                  value={formData.name}
                  placeholder="Adınız"
                  onChange={handleChange}
                />
              </div>

              <div className="flex-1">
                <Input
                  label="Soyad"
                  name="surname"
                  value={formData.surname}
                  placeholder="Soyadınız"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                placeholder="ornek@mail.com"
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  label="Parola"
                  type="password"
                  name="password"
                  value={formData.password}
                  placeholder="••••••••"
                  onChange={handleChange}
                />
              </div>

              <div className="flex-1 relative">
                <Select
                  label="Üye Alanı"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={[
                    { value: "satici", label: "Satıcı" },
                    { value: "alici", label: "Alıcı" },
                  ]}
                />

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
            {loading ? "Kayıt Olunuyor..." : "Üye Ol"}
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
