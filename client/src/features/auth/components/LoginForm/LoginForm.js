import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Heading, Input } from "@/shared/components/atoms";
import { loginSchema } from "@/shared/validation/schemas";
import { useLogin } from "../../hooks/useAuthActions";
import { AuthLayout } from "../AuthLayout";

export function LoginForm() {
  const login = useLogin();
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { errors } = formState;

  return (
    <AuthLayout>
      <form
        noValidate
        onSubmit={handleSubmit((values) => login.mutate(values))}
        className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-7 sm:p-9"
      >
        <div className="mb-8">
          <Heading
            title="Giriş Yap"
            desc="Seni tekrar görmek güzel! Devam etmek için hesabına giriş yap."
            className="text-3xl font-semibold text-[rgb(71,92,120)]"
          />
        </div>

        <div className="space-y-5">
          <Input
            {...register("email")}
            label="E-posta"
            type="email"
            autoComplete="email"
            placeholder="ornek@mail.com"
            error={errors.email?.message}
          />
          <Input
            {...register("password")}
            label="Parola"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={login.isPending}
          loadingText="Giriş yapılıyor..."
          className="w-full mt-7 text-sm font-medium"
        >
          Giriş Yap
        </Button>

        <p className="text-center mt-8 text-sm text-gray-500">
          Hesabın yok mu?{" "}
          <Link to="/uye-ol" className="font-semibold text-[rgb(40,100,210)] hover:underline">
            Yeni hesap oluştur
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
