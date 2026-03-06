import {XMarkIcon,ArrowRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import usePostUpdated from "../../../hooks/feed/posts/usePost"
import usePostAll from "../../../hooks/feed/posts/usePostDetails"
export const UpdatedPostForm = ({editPostId,setOpen}) => {


 const {details}=usePostAll(editPostId)
 const {handleUpdatePost,loading} =usePostUpdated()
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files); 
    if (!files.length) return;
  
    const imageUrls = files.map((file) => URL.createObjectURL(file));
  
    setForm((prev) => ({
      ...prev,
      images: imageUrls, 
      files: files, 
    }));
  };

  useEffect(() => {
    if (details) {
      setForm({
        ownerName: details.ownerName || "",
        ownerSurname: details.ownerSurname || "",
        ownerRole: details.ownerRole || "",
        title: details.title || "",
        description: details.description || "",
        province: details.province || "",
        district: details.district || "",
        category: details.category || "",
        images: details.images || [],
      });
    }
  }, [details]);
  const handleSubmit = (e) => {
    console.log(formData)
    e.preventDefault();
    handleUpdatePost(details?._id, formData);
    setOpen(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto  rounded-2xl p-8 space-y-6 m-2"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-500">
          Gönderiyi Düzenle
        </h2>

        <button type="button" onClick={()=>setOpen(false)} >
          <XMarkIcon className="w-6 h-6 text-gray-700 hover:text-red-500 cursor-pointer transition" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="ownerName"
          placeholder="Ad"
          value={formData?.ownerName || ""}
          onChange={handleChange}
          disabled
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
        />

        <input
          type="text"
          name="ownerSurname"
          placeholder="Soyad"
          value={formData?.ownerSurname  || ""}
          onChange={handleChange}
          disabled
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
        />
      </div>

      <select
        name="ownerRole"
        disabled
        value={formData?.ownerRole  || ""}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2"
      >
       
        <option value="alici">Alıcı</option>
        <option value="satici">Satıcı</option>
      </select>

      <input
        type="text"
        name="title"
        placeholder="Başlık"
        value={formData?.title  || ""}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2"
      />

      <textarea
        name="description"
        placeholder="Açıklama"
        value={formData?.description  || ""}
        onChange={handleChange}
        rows={4}
        className="w-full border rounded-lg px-4 py-2"
      />

      <div className="flex gap-4">
        <input
          type="text"
          name="province"
          placeholder="İl"
          value={formData?.province  || ""}
          disabled
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="text"
          name="district"
          placeholder="İlçe"
          disabled
          value={formData?.district  || ""}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <select
        name="category"
        value={formData?.category  || ""}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2"
      >
        <option value="">Seçim yapınız</option>
        <option value="sut_urunleri">Süt Ürünleri</option>
        <option value="bal">Bal</option>
        <option value="zeytinyagi">Zeytinyağı</option>
        <option value="peynir">Peynir</option>
        <option value="sebze">Sebze</option>
        <option value="meyve">Meyve</option>
      </select>
      <input
            type="file"
            multiple
            onChange={handleImages}
            className="w-full"
          />


      <div className="flex justify-end">
        <button
          type="submit"
       disabled={loading}
          className="bg-[rgb(137,205,251)] text-white p-3 rounded-full"
        >
    {loading ? "Yükleniyor..." : <ArrowRightIcon className="w-4 h-4" />} 
        </button>
      </div>
    </form>
  );
};