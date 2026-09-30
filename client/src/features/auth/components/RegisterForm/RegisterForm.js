import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Heading, Input, Select } from "@/shared/components/atoms";
import { registerSchema } from "@/shared/validation/schemas";
import { useRegister } from "../../hooks/useAuthActions";
import { AuthLayout } from "../AuthLayout";

const ROLE_OPTIONS = [
  { value: "satici", label: "Satıcı" },
  { value: "alici", label: "Alıcı" },
];

export function RegisterForm() {
  const registerAccount = useRegister();
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", surname: "", email: "", password: "", role: "satici" },
  });
  const { errors } = formState;

  return (
    <AuthLayout>
      <form
        noValidate
        onSubmit={handleSubmit((values) => registerAccount.mutate(values))}
        className="bg-white p-8 rounded-2xl shadow-lg"
      >
        <Heading
          title="Kayıt Ol"
          desc="Hesabınızı oluşturmak için bilgilerinizi giriniz."
          className="text-3xl font-semibold text-[rgb(71,92,120)]"
        />

        <div className="space-y-5">
          <div className="flex gap-3">
            <Input {...register("name")} label="Ad" autoComplete="given-name" error={errors.name?.message} wrapperClassName="flex-1" />
            <Input
              {...register("surname")}
              label="Soyad"
              autoComplete="family-name"
              error={errors.surname?.message}
              wrapperClassName="flex-1"
            />
          </div>

          <Input
            {...register("email")}
            label="E-posta"
            type="email"
            autoComplete="email"
            placeholder="ornek@mail.com"
            error={errors.email?.message}
          />

          <div className="flex gap-3">
            <Input
              {...register("password")}
              label="Parola"
              type="password"
              autoComplete="new-password"
              placeholder="En az 8 karakter"
              error={errors.password?.message}
              wrapperClassName="flex-1"
            />
            <Select
              {...register("role")}
              label="Üyelik türü"
              options={ROLE_OPTIONS}
              error={errors.role?.message}
              wrapperClassName="flex-1"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={registerAccount.isPending}
          loadingText="Kayıt olunuyor..."
          className="w-full mt-7 text-sm font-medium"
        >
          Üye Ol
        </Button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Üye misin?{" "}
          <Link to="/giris-yap" className="text-[rgb(40,100,210)] font-semibold hover:underline">
            Giriş yap
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
