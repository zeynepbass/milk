import { Link } from "react-router-dom";
import { useState } from "react";
import useUserLogin from "@/features/auth/hooks/useUser";
import { Input, Button, Heading } from "@/shared/components/atoms";

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


      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">

          <div className="flex justify-center mb-8  md:hidden">
            <img
              src="/assets/footer-logo.png"
              width="120"
              height="60"
              alt="Milk logo"
              className="object-contain"
            />
          </div>

          <form
            onSubmit={onSubmit}
            className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-7 sm:p-9"
          >

            <div className="mb-8">
            <div className="mb-8">
  <Heading
    title="Giriş Yap"
    desc="Seni tekrar görmek güzel! Devam etmek için hesabına giriş yap."
    className="text-3xl font-semibold text-[rgb(71,92,120)]"
  />
</div>
            </div>


            <div className="space-y-5">
              <Input
                label="Email"
                type="email"
                className="py-2"
                name="email"
                value={formData.email}
                placeholder="ornek@mail.com"
                onChange={handleChange}
              />

              <Input
                label="Parola"
                type="password"
                name="password"
                    className="py-2"
                value={formData.password}
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>


            <Button
              type="submit"
                   variant="primary"
              className="w-full mt-7 text-sm font-medium transition-all hover:shadow-md"
            >
              Giriş Yap
            </Button>


            <div className="flex items-center gap-4 mt-8">
              <span className="flex-1 h-px bg-gray-200" />

              <span className="text-sm text-gray-400 whitespace-nowrap">
                Hesabın yok mu?
              </span>

              <span className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="text-center mt-4">
              <Link
                to="/uye-ol"
                className="inline-flex items-center justify-center text-sm font-semibold text-[rgb(82,144,246)] hover:text-[rgb(60,120,220)] hover:underline transition-colors"
              >
                Yeni hesap oluştur
              </Link>
            </div>
          </form>


          <p className="text-center text-xs text-gray-400 mt-6">
            Giriş yaparak hizmetlerimizi kullanmaya devam edebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}