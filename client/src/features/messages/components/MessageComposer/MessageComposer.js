import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/shared/components/atoms";
import { messageSchema } from "@/shared/validation/schemas";

export function MessageComposer({ disabled, pending, onSend }) {
  const { register, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: "" },
  });

  const submit = ({ text }) => {
    onSend(text);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="p-3 border-t bg-white dark:bg-gray-800 dark:border-gray-700 flex gap-2 items-start"
    >
      <Input
        {...register("text")}
        label="Mesaj"
        placeholder={disabled ? "Önce bir sohbet seç" : "Mesaj yaz..."}
        autoComplete="off"
        disabled={disabled}
        error={formState.errors.text?.message}
        wrapperClassName="flex-1 min-w-0 [&_label]:sr-only"
      />

      <Button
        type="submit"
        variant="primary"
        disabled={disabled || pending}
        className="shrink-0 rounded-full px-5 py-2"
      >
        Gönder
      </Button>
    </form>
  );
}
