import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, Textarea } from "@/shared/components/atoms";
import { POST_CATEGORY_OPTIONS, postSchema } from "@/shared/validation/schemas";
import { ImagePicker } from "./ImagePicker";

const toDefaults = (post, fallbackLocation) => ({
  title: post?.title ?? "",
  description: post?.description ?? "",
  category: post?.category ?? "",
  province: post?.province ?? fallbackLocation?.province ?? "",
  district: post?.district ?? fallbackLocation?.district ?? "",
});

export function PostForm({ post, fallbackLocation, submitLabel, pending, onSubmit }) {
  const [files, setFiles] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const existing = (post?.images ?? []).filter((url) => !removeImages.includes(url));

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: toDefaults(post, fallbackLocation),
  });
  const { errors } = formState;

  const submit = (values) => onSubmit({ values, files, removeImages });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <Input {...register("title")} label="Başlık" error={errors.title?.message} />

      <Textarea {...register("description")} label="Açıklama" rows={4} error={errors.description?.message} />

      <Select
        {...register("category")}
        label="Kategori"
        options={POST_CATEGORY_OPTIONS}
        error={errors.category?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input {...register("province")} label="İl" error={errors.province?.message} />
        <Input {...register("district")} label="İlçe" error={errors.district?.message} />
      </div>

      <ImagePicker
        existing={existing}
        files={files}
        onFilesChange={setFiles}
        onRemoveExisting={(url) => setRemoveImages((current) => [...current, url])}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          loading={pending}
          loadingText="Kaydediliyor..."
          text={submitLabel}
        />
      </div>
    </form>
  );
}
