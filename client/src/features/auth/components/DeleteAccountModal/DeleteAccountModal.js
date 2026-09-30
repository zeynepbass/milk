import { useState } from "react";
import { Button, Input } from "@/shared/components/atoms";

export function DeleteAccountModal({ onConfirm, onClose }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await onConfirm(password);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg space-y-4"
      >
        <h2 id="delete-account-title" className="text-xl font-bold text-gray-700">
          Hesabı Sil
        </h2>

        <p className="text-gray-500">Bu işlem geri alınamaz. Devam etmek için şifrenizi girin.</p>

        <Input
          type="password"
          label="Şifre"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="py-2"
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={onClose} variant="dark" className="bg-gray-200">
            İptal
          </Button>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            loadingText="Siliniyor..."
            className="bg-red-500"
          >
            Hesabı sil
          </Button>
        </div>
      </form>
    </div>
  );
}
