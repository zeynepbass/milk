import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";
import useUserLogin from "@/features/auth/hooks/useUser";
import { useState } from "react";
import {Input,Select,Button,Heading} from "@/shared/components/atoms"


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
    <div className="min-h-screen flex bg-gray-50">

      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img
          src="/assets/wallpaper.png"
          alt="Milk Wallpaper"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/35" />





        <div className="absolute bottom-10 left-10 right-10 z-10 text-white">

          <img
            src="/assets/footer-logo.png"
            width="80"
            height="40"
            alt="Milk logo"
            className="object-contain"
          />

          <h2 className="text-3xl lg:text-4xl font-semibold leading-tight pt-4">
            İşlerinizi daha kolay
            <br />
            yönetmeye başlayın.
          </h2>

          <p className="mt-4 max-w-md text-sm lg:text-base text-white/75 leading-relaxed">
            Hesabınıza giriş yaparak platformdaki tüm özelliklere
            hızlı ve güvenli bir şekilde erişebilirsiniz.
          </p>
        </div>
      </div>

      <div className="flex w-full md:w-1/2 justify-center items-center bg-white px-6">
        <form
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
          onSubmit={onSubmit}
        >

            <Heading title=" Kayıt Ol" desc="Hesabınızı oluşturmak için bilgilerinizi giriniz." className="text-3xl font-semibold text-[rgb(71,92,120)]"/>
   


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

          <Button
  type="submit"
  variant="primary"
  disabled={loading}
  className="mt-6"
>
  {loading ? "Kayıt Olunuyor..." : "Üye Ol"}
</Button>
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
