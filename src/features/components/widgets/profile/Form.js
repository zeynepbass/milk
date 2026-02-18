
import { ArrowRightIcon,XMarkIcon } from "@heroicons/react/24/outline";
export function CreatePostForm({ onSubmit, loading,form,setForm,setOpen}) {


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, images: imageUrls }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setOpen(false)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6"
    >
      <p className="flex justify-between">    
          <h2 className="text-2xl font-bold text-gray-500">Yeni Gönderi Oluştur</h2>
    <button onClick={()=>setOpen(false)}> <XMarkIcon className="w-6 h-6 text-gray-700 hover:text-red-500 cursor-pointer transition" /></button> </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="ownerName"
          placeholder="Ad"
          value={form.ownerName}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
          required
        />
        <input
          type="text"
          name="ownerSurname"
          placeholder="Soyad"
          value={form.ownerSurname}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
          required
        />
      </div>

      <select
        name="ownerRole"
        value={form.ownerRole}
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
        value={form.title}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
        required
      />

      <textarea
        name="description"
        placeholder="Açıklama"
        value={form.description}
        onChange={handleChange}
        rows={4}
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
      />

      <input
        type="text"
        name="district"
        placeholder="İlçe"
        value={form.district}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
        required
      >
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
          className="bg-[rgb(137,205,251)] text-white p-2 rounded-full"
        >
          {" "}
          {loading ? "Paylaşılıyor..." : <ArrowRightIcon className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
}
