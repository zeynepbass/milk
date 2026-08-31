import { useEffect, useState } from "react";
import usePostUpdated from "@/features/feed/hooks/post/usePost";
import usePostAll from "@/features/feed/hooks/post/usePostDetails";
import {
  Input,
  Select,
  Textarea,
  Button,
} from "@/shared/components/atoms";
import {
  XMarkIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export const UpdatedPostForm = ({ editPostId, setOpen }) => {
  const { details } = usePostAll(editPostId);
  const { handleUpdatePost, loading } = usePostUpdated();

  const [formData, setForm] = useState({
    ownerName: "",
    ownerSurname: "",
    ownerRole: "",
    title: "",
    description: "",
    province: "",
    district: "",
    category: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setForm((prev) => ({
      ...prev,
      images: files,
    }));
  };

  useEffect(() => {
    if (!details) return;

    setForm({
      ownerName: details.ownerName || "",
      ownerSurname: details.ownerSurname || "",
      ownerRole: details.ownerRole || "",
      title: details.title || "",
      description: details.description || "",
      province: details.province || "",
      district: details.district || "",
      category: details.category || "",
      images: [],
    });
  }, [details]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append("ownerName", formData.ownerName);
    formDataToSend.append("ownerSurname", formData.ownerSurname);
    formDataToSend.append("ownerRole", formData.ownerRole);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("province", formData.province);
    formDataToSend.append("district", formData.district);
    formDataToSend.append("category", formData.category);

    formData.images.forEach((file) => {
      if (file instanceof File) {
        formDataToSend.append("images", file);
      }
    });

    await handleUpdatePost(details?._id, formDataToSend);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-2 space-y-6 "
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-300">
          Gönderiyi Düzenle
        </h2>

        <Button
          type="button"
          onClick={() => setOpen(false)}
          className="p-2 text-gray-700 hover:text-red-500 dark:text-gray-300"
        >
          <XMarkIcon className="w-6 h-6" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="ownerName"
          placeholder="Ad"
          value={formData.ownerName}
          onChange={handleChange}
          className="py-2"
        />

        <Input
          name="ownerSurname"
          placeholder="Soyad"
          value={formData.ownerSurname}
          onChange={handleChange}
          className="py-2"
        />
      </div>

      <Select
        name="ownerRole"
        value={formData.ownerRole}
        onChange={handleChange}
        placeholder="Rol seçiniz"
        options={[
          { value: "alici", label: "Alıcı" },
          { value: "satici", label: "Satıcı" },
        ]}
      />

      <Input
        name="title"
        placeholder="Başlık"
        value={formData.title}
        onChange={handleChange}
        className="py-2"
      />

      <Textarea
        name="description"
        placeholder="Açıklama"
        value={formData.description}
        onChange={handleChange}
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="province"
          placeholder="İl"
          value={formData.province}
          onChange={handleChange}
          className="py-2"
        />

        <Input
          name="district"
          placeholder="İlçe"
          value={formData.district}
          onChange={handleChange}
          className="py-2"
        />
      </div>

      <Select
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Seçim yapınız"
        options={[
          { value: "sut_urunleri", label: "Süt Ürünleri" },
          { value: "bal", label: "Bal" },
          { value: "zeytinyagi", label: "Zeytinyağı" },
          { value: "peynir", label: "Peynir" },
          { value: "sebze", label: "Sebze" },
          { value: "meyve", label: "Meyve" },
        ]}
      />

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImages}
        className="w-full"
      />

      {formData.images.length > 0 && (
        <p className="text-sm text-gray-500">
          {formData.images.length} görsel seçildi
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          loadingText="Güncelleniyor..."
          text="Güncelle"

          disabled={loading}
        />
      </div>
    </form>
  );
};