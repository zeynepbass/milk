import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button, Heading, Textarea } from "@/shared/components/atoms";
import { feedbackSchema } from "@/shared/validation/schemas";
import { useSendFeedback } from "../../hooks/useAccountMutations";

const TYPES = [
  { label: "Genel", value: "genel" },
  { label: "Hata Bildirimi", value: "hata" },
  { label: "Talep", value: "talep" },
];

export function SalesSupport() {
  const sendFeedback = useSendFeedback();
  const { register, handleSubmit, reset, watch, formState } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { type: "genel", message: "" },
  });
  const selectedType = watch("type");

  const submit = (values) => sendFeedback.mutate(values, { onSuccess: () => reset() });

  return (
    <div className="p-6 bg-white dark:bg-gray-800 dark:border-gray-700 rounded-2xl shadow-lg border space-y-6">
      <Heading title="Görüş, Öneri veya Hata Bildir" desc="Geri bildirimleriniz bizim için değerlidir." />

      <form noValidate onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
        <fieldset>
          <legend className="text-sm text-gray-600 dark:text-gray-300 mb-2">Geri bildirim türü</legend>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((type) => (
              <label
                key={type.value}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-blue-500 ${
                  selectedType === type.value
                    ? "bg-[rgb(82,144,246)] text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                }`}
              >
                <input type="radio" value={type.value} {...register("type")} className="sr-only" />
                {type.label}
              </label>
            ))}
          </div>
        </fieldset>

        <Textarea
          {...register("message")}
          rows={5}
          label="Mesaj"
          placeholder="Mesajınızı yazın..."
          error={formState.errors.message?.message}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={sendFeedback.isPending}
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
