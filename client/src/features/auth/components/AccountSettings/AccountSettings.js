import { useState } from "react";
import { Button, Heading } from "@/shared/components/atoms";
import { Modal } from "@/shared/components/molecules";
import { useFreezeAccount } from "../../hooks/useAccountMutations";
import { ChangePasswordForm } from "../ChangePasswordForm";
import { DeleteAccountModal } from "../DeleteAccountModal";

const CARD = "bg-white shadow-lg rounded-2xl p-6 border dark:bg-gray-800 dark:border-gray-700 border-gray-100";

export function AccountSettings() {
  const [freezeOpen, setFreezeOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const freeze = useFreezeAccount();

  return (
    <div className="space-y-6">
      <ChangePasswordForm />

      <div className={CARD}>
        <Heading
          title="Hesabı Dondur"
          desc="Hesabınızı geçici olarak dondurabilirsiniz. Tekrar giriş yaptığınızda hesabınız yeniden açılır."
        />
        <Button type="button" onClick={() => setFreezeOpen(true)} className="text-[rgb(40,100,210)] dark:text-yellow-400">
          Hesabı Dondur
        </Button>
      </div>

      <div className={CARD}>
        <Heading title="Hesabı Sil" desc="Hesabınızı silerseniz tüm içerikleriniz gizlenir ve geri alınamaz." />
        <Button type="button" onClick={() => setDeleteOpen(true)} className="text-red-600">
          Hesabı Sil
        </Button>
      </div>

      <Modal open={freezeOpen} onClose={() => setFreezeOpen(false)} title="Hesabı Dondur" size="sm">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Hesabınızı dondurmak istediğinize emin misiniz? Tüm oturumlarınız kapatılır.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={() => setFreezeOpen(false)}>
            İptal
          </Button>
          <Button type="button" variant="primary" loading={freeze.isPending} onClick={() => freeze.mutate()}>
            Onayla
          </Button>
        </div>
      </Modal>

      <DeleteAccountModal open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </div>
  );
}
