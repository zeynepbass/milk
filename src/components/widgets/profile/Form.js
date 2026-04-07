import {
  ArrowRightIcon,
  XMarkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
  
    setForm((prev) => ({
      ...prev,
      images: files, // ❗ artık base64 değil File[]
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

    if (form.images && form.images.length > 0) {
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
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Yeni Gönderi Oluştur
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Ürün bilgilerini girin ve görsellerinizi yükleyin.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded-full  hover:bg-gray-100 dark:hover:bg-gray-800  transition"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-red-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              disabled
              value={form.ownerName ?? profileForm.ownerName}
              className="border rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
            />

            <input
              type="text"
              disabled
              value={form.ownerSurname ?? profileForm.ownerSurname}
              className="border rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
            />
          </div>

          <select
            disabled
            value={form.ownerRole ?? profileForm.ownerRole}
            className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
          >
            <option value="alici">Alıcı</option>
            <option value="satici">Satıcı</option>
          </select>

          <input
            type="text"
            name="title"
            placeholder="Başlık"
            value={form.title ?? ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
            required
          />

          <textarea
            name="description"
            placeholder="Açıklama"
            value={form.description ?? ""}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none resize-none"
          />

          <div className="flex gap-4">
            <input
              type="text"
              disabled
              value={form.province ?? ""}
              placeholder="İl"
              className="w-full border rounded-lg px-4 py-2 bg-gray-100"
            />

            <input
              type="text"
              disabled
              value={form.district ?? ""}
              placeholder="İlçe"
              className="w-full border rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <select
            name="category"
            value={form.category ?? ""}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
          >
            <option value="" disabled>
              Seçim yapınız
            </option>
            <option value="sut_urunleri">Süt Ürünleri</option>
            <option value="bal">Bal</option>
            <option value="zeytinyagi">Zeytinyağı</option>
            <option value="peynir">Peynir</option>
            <option value="sebze">Sebze</option>
            <option value="meyve">Meyve</option>
          </select>

          {form.images?.length > 0 && (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {form.images.map((file, i) => (
      <div key={i} className="relative group">
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          className="w-full h-24 object-cover rounded-lg border"
        />

        <button
          type="button"
          onClick={() => removeImage(i)}
          className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
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
            <button
              type="submit"
              disabled={postLoading}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {postLoading ? (
                "Paylaşılıyor..."
              ) : (
                <ArrowRightIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>{" "}
      </div>{" "}
    </div>
  );
}
