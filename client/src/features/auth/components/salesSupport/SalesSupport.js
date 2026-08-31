import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import usePost from "@/features/feed/hooks/user/useUserPost";
import { Textarea, Heading, Button } from "@/shared/components/atoms";

export function SalesSupports() {
  const { onSubmitFeedback, feedback } = usePost();

  const [type, setType] = useState("genel");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const payload = {
      type,
      message,
    };

    await onSubmitFeedback(payload);

    setMessage("");
    setType("genel");
  };

  const types = [
    { label: "Genel", value: "genel" },
    { label: "Hata Bildirimi", value: "hata" },
    { label: "Talep", value: "talep" },
  ];

  return (
    <div className="max-w-full mx-auto p-6 bg-white dark:bg-gray-800 dark:border-gray-400 rounded-2xl shadow-lg border space-y-6">
      <Heading
        title="Görüş, Öneri veya Hata Bildir"
        desc="Geri bildirimleriniz bizim için değerlidir."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-500">
            Geri bildirim türü
          </label>

          <div className="flex flex-wrap gap-2">
            {types.map((item) => (
              <Button
                key={item.value}
                type="button"
                active={type === item.value}
                onClick={() => setType(item.value)}
                className={
                  type === item.value
                    ? "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-200"
                    : "bg-blue-500 text-white dark:bg-gray-900 dark:text-gray-400"
                }
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          label="Mesaj"
          placeholder="Mesajınızı yazın..."
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!message.trim() || feedback}
            loading={feedback}
            variant="primary"
            text="Gönder"
            loadingText="Gönderiliyor..."
            icon={ArrowRightIcon}
          />
        </div>
      </form>
    </div>
  );
}