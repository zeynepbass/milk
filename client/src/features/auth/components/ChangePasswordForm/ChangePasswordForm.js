import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Heading, Input } from "@/shared/components/atoms";
import { changePasswordSchema } from "@/shared/validation/schemas";
import { useChangePassword } from "../../hooks/useAccountMutations";

export function ChangePasswordForm() {
  const changePassword = useChangePassword();
  const { register, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });
  const { errors } = formState;

  const submit = (values) => changePassword.mutate(values, { onSuccess: () => reset() });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submit)}
      className="bg-white shadow-lg rounded-2xl p-6 border dark:bg-gray-800 dark:border-gray-700 border-gray-100 space-y-4"
    >
      <Heading title="Şifre Değiştir" desc="Şifreniz değişince diğer cihazlardaki oturumlarınız kapanır." />

      <Input
        {...register("currentPassword")}
        type="password"
        label="Mevcut şifre"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
      />
      <Input
        {...register("newPassword")}
        type="password"
        label="Yeni şifre"
        autoComplete="new-password"
        error={errors.newPassword?.message}
      />

      <Button
        type="submit"
        variant="primary"
        loading={changePassword.isPending}
        loadingText="Kaydediliyor..."
        text="Şifreyi güncelle"
      />
    </form>
  );
}
