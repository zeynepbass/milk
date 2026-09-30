import { useState } from "react";
import { Button, Heading, Input } from "@/shared/components/atoms";

const EMPTY_FORM = { currentPassword: "", newPassword: "" };

export function ChangePasswordForm({ onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const ok = await onSubmit(form.currentPassword, form.newPassword);

    setLoading(false);
    if (ok) setForm(EMPTY_FORM);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg dark:border-gray-400 rounded-2xl p-6 border dark:bg-gray-800 border-gray-100 space-y-4"
    >
      <Heading title="Şifre Değiştir" desc="Şifreniz değişince diğer cihazlardaki oturumlarınız kapanır." />

      <Input
        type="password"
        name="currentPassword"
        label="Mevcut şifre"
        autoComplete="current-password"
        value={form.currentPassword}
        onChange={handleChange}
        className="py-2"
      />

      <Input
        type="password"
        name="newPassword"
        label="Yeni şifre"
        autoComplete="new-password"
        minLength={8}
        value={form.newPassword}
        onChange={handleChange}
        className="py-2"
      />

      <Button type="submit" variant="primary" loading={loading} loadingText="Kaydediliyor..." text="Şifreyi güncelle" />
    </form>
  );
}
