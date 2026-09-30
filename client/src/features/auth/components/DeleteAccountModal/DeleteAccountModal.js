import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/shared/components/atoms";
import { Modal } from "@/shared/components/molecules";
import { deleteAccountSchema } from "@/shared/validation/schemas";
import { useDeleteAccount } from "../../hooks/useAccountMutations";

export function DeleteAccountModal({ open, onClose }) {
  const deleteAccount = useDeleteAccount();
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: "" },
  });

  return (
    <Modal open={open} onClose={onClose} title="Hesabı Sil" size="sm">
      <form noValidate onSubmit={handleSubmit(({ password }) => deleteAccount.mutate(password))} className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Gönderilerin, yorumların ve sohbetlerin gizlenir; bu işlem geri alınamaz. Devam etmek için şifreni gir.
        </p>

        <Input
          {...register("password")}
          type="password"
          label="Şifre"
          autoComplete="current-password"
          error={formState.errors.password?.message}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            İptal
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={deleteAccount.isPending}
            loadingText="Siliniyor..."
            className="bg-red-600"
          >
            Hesabı sil
          </Button>
        </div>
      </form>
    </Modal>
  );
}
