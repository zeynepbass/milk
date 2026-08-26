import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

import { Input, Select, Textarea, Button,Heading } from "@/shared/components/atoms";

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

      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white rounded-2xl p-8 space-y-6"
        >
          <div className="flex justify-between items-start border-b pb-4">
            <Heading title=" Yeni Gönderi Oluştur" desc=" Ürün bilgilerini girin ve görsellerinizi yükleyin."/>


            <Button
              type="button"
              onClick={() => setOpen(false)}
              icon={XMarkIcon}
              className="text-gray-500 hover:text-red-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="ownerName"
              placeholder="Ad"
              value={form.ownerName ?? profileForm?.ownerName ?? ""}
              disabled
            />

            <Input
              name="ownerSurname"
              placeholder="Soyad"
              value={form.ownerSurname ?? profileForm?.ownerSurname ?? ""}
              disabled
            />
          </div>

          <Select
            disabled
            value={form.ownerRole ?? profileForm?.ownerRole ?? ""}
            placeholder="Rol seçiniz"
            options={[
              { value: "alici", label: "Alıcı" },
              { value: "satici", label: "Satıcı" },
            ]}
            className="bg-gray-100 text-gray-600"
          />
          <Input
            name="title"
            placeholder="Başlık"
            value={form.title ?? ""}
            onChange={handleChange}
            required
          />

          <Textarea
            name="description"
            placeholder="Açıklama"
            value={form.description ?? ""}
            onChange={handleChange}
            rows={4}
          />

          <div className="flex gap-4">
            <Input
              name="province"
              placeholder="İl"
              value={form.province ?? ""}
              disabled
            />

            <Input
              name="district"
              placeholder="İlçe"
              value={form.district ?? ""}
              disabled
            />
          </div>

          <Select
            name="category"
            value={form.category ?? ""}
            onChange={handleChange}
            required
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

          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-blue-400 transition bg-gray-50">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
              className="hidden"
            />

            <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />

            <p className="text-sm text-gray-500">
              Görselleri yüklemek için tıklayın veya sürükleyin
            </p>
          </label>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={postLoading}
              loading={postLoading}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
