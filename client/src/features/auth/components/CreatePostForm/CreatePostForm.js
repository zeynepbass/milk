import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

import {
  Input,
  Select,
  Textarea,
  Button,
  Heading,
} from "@/shared/components/atoms";

export function CreatePostForm({
  onSubmit,
  postLoading,
  form,
  setForm,
  setOpen,
  profileForm,
}) {
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

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", form.title || "");
    formData.append("description", form.description || "");
    formData.append("province", form.province || "");
    formData.append("district", form.district || "");
    formData.append("category", form.category || "");
    formData.append("ownerRole", form.ownerRole || "");
    if (form.images?.length > 0) {
      form.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    onSubmit(formData);

    setForm({
      images: [],
      title: "",
      description: "",
      province: "",
      district: "",
      category: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />

      <div className="relative w-full max-w-4xl mx-4  bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8 space-y-6"
        >
          <div className="flex justify-between items-start border-b pb-4">
            <Heading
              title=" Yeni Gönderi Oluştur"
              desc=" Ürün bilgilerini girin ve görsellerinizi yükleyin."
            />

            <Button
              type="button"
              onClick={() => setOpen(false)}
              icon={XMarkIcon}
              variant="dark"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              name="ownerName"
              placeholder="Ad"
              className="py-2"
              value={form.ownerName ?? profileForm?.ownerName ?? ""}
              disabled
            />

            <Input
              name="ownerSurname"
              placeholder="Soyad"
              value={form.ownerSurname ?? profileForm?.ownerSurname ?? ""}
              className="py-2"
              disabled
            />

            <Input
              name="province"
              placeholder="İl"
              className="py-2"
              value={form.province ?? ""}
              disabled
            />

            <Input
              name="district"
              placeholder="İlçe"
              className="py-2"
              value={form.district ?? ""}
              disabled
            />
          </div>

          <Select
  name="ownerRole"
  onChange={handleChange}

  value={form.ownerRole ?? profileForm?.ownerRole ?? ""}
  placeholder="Rol seçiniz"
  options={[
    { value: "alici", label: "Alıcı" },
    { value: "satici", label: "Satıcı" },
  ]}
/>
          <Input
            name="title"
            placeholder="Başlık"
            className="py-2"
            value={form.title ?? ""}
            onChange={handleChange}

          />

          <Textarea
            name="description"
            placeholder="Açıklama"
            value={form.description ?? ""}
            onChange={handleChange}
            rows={4}
          />

          <Select
            name="category"
            value={form.category ?? ""}
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
          {form.images?.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {form.images.map((file, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    onClick={() => removeImage(i)}
                    icon={XMarkIcon}
                    className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 p-1 opacity-0 group-hover:opacity-100"
                  />
                </div>
              ))}
            </div>
          )}

          <label className="flex flex-col dark:bg-gray-900 items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-blue-400 transition bg-gray-50">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}

              className="hidden "
            />

            <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />

            <p className="text-sm text-gray-500">
              Görselleri yüklemek için tıklayın veya sürükleyin
            </p>
          </label>

          <div className="flex justify-end">
          <Button
  variant="primary"
  type="submit"
  disabled={postLoading}
  loading={postLoading}
  text="Gönder"
  loadingText="Gönderiliyor..."
/>
          </div>
        </form>
      </div>
    </div>
  );
}
