import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
export function CreatePostForm({ onSubmit, loading, form, setForm, setOpen }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, images: imageUrls }));

    files.forEach((file) => URL.revokeObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setOpen(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6 m-2"
    >
    <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Yeni Gönderi Oluştur
        </h2>

        <button type="button" onClick={() => setOpen(false)}>
          <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-red-500 transition" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="ownerName"
          disabled
          placeholder="Ad"
          value={form.ownerName || ""}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
          required
        />
        <input
          type="text"
          name="ownerSurname"
          placeholder="Soyad"
          disabled
          value={form.ownerSurname || ""}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
          required
        />
      </div>

      <select
        name="ownerRole"
        disabled
        value={form?.ownerRole  || ""}

        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
      >
 
        <option value="alici">Alıcı</option>
        <option value="satici">Satıcı</option>
      </select>

      <input
        type="text"
        name="title"
        placeholder="Başlık"
        value={form.title || ""}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
        required
      />

      <textarea
        name="description"
        placeholder="Açıklama"
        value={form.description || ""}
        onChange={handleChange}
        rows={4}
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
      />
      <div className="flex gap-4">
        <input
          type="text"
          name="province"
          disabled
          placeholder="İl"
          value={form.province || ""}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
        />
        <input
          type="text"
          name="district"
          disabled
          placeholder="İlçe"
          value={form.district || ""}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
        />
      </div>

      <select
        name="category"
        value={form.category || ""}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
        required
      >
        {" "}
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

      <input type="file" multiple onChange={handleImages} className="w-full" />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-[rgb(137,205,251)] text-white px-4 py-2 rounded-full flex items-center justify-center disabled:opacity-50"
        >
          {loading ? "Paylaşılıyor..." : <ArrowRightIcon className="w-5 h-5" />}
        </button>
      </div>
    </form>
  );
}
