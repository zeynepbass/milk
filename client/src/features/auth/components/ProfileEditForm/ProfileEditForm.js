import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/shared/components/atoms";
import { profileSchema } from "@/shared/validation/schemas";
import { useSaveProfile } from "../../hooks/useAccountMutations";

const toDefaults = (user) => ({
  name: user.name ?? "",
  surname: user.surname ?? "",
  province: user.province ?? "",
  district: user.district ?? "",
  email: user.email ?? "",
  originalEmail: user.email ?? "",
  currentPassword: "",
});

export function ProfileEditForm({ user, onDone }) {
  const saveProfile = useSaveProfile();
  const { register, handleSubmit, watch, formState } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: toDefaults(user),
  });
  const { errors } = formState;
  const emailChanged = watch("email").trim().toLowerCase() !== user.email;

  const submit = (values) => saveProfile.mutate({ values, current: user }, { onSuccess: onDone });

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input {...register("name")} label="Ad" autoComplete="given-name" error={errors.name?.message} />
        <Input
          {...register("surname")}
          label="Soyad"
          autoComplete="family-name"
          error={errors.surname?.message}
        />
        <Input {...register("province")} label="İl" error={errors.province?.message} />
        <Input {...register("district")} label="İlçe" error={errors.district?.message} />
      </div>

      <Input
        {...register("email")}
        label="E-posta"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
      />

      {emailChanged && (
        <Input
          {...register("currentPassword")}
          label="Mevcut şifre"
          type="password"
          autoComplete="current-password"
          error={errors.currentPassword?.message}
        />
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Vazgeç
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={saveProfile.isPending}
          loadingText="Kaydediliyor..."
          text="Kaydet"
        />
      </div>
    </form>
  );
}
