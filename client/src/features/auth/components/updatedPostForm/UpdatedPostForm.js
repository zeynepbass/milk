import { useEffect, useState } from "react";
import usePostUpdated from "@/features/feed/hooks/post/usePost";
import { Input,Select,Textarea,Button } from "@/shared/components/atoms";
import usePostAll from "@/features/feed/hooks/post/usePostDetails";
import { XMarkIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImages = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
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

    e.preventDefault();
    handleUpdatePost(details?._id, formData);
    setOpen(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto  rounded-2xl p-2 space-y-6 m-2"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-500">Gönderiyi Düzenle</h2>

        <Button
  type="button"
  onClick={() => setOpen(false)}
  className="p-0 text-gray-700 hover:text-red-500 dark:text-gray-300 transition"
>
  <XMarkIcon className="w-6 h-6" />
</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="ownerName"
          placeholder="Ad"
          value={formData?.ownerName || ""}
          className="py-2"
          onChange={handleChange}
       
        />

        <Input
          name="ownerSurname"
          placeholder="Soyad"
                    className="py-2"
          value={formData?.ownerSurname || ""}
          onChange={handleChange}
   
        />
      </div>

      <Select
  name="ownerRole"
  
  value={formData?.ownerRole || ""}
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
        value={formData?.title || ""}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2"
        
      />
<Textarea
  name="description"
  placeholder="Açıklama"
  value={formData?.description || ""}
  onChange={handleChange}
  rows={4}
/>

      <div className="flex gap-4">
      <Input
       name="province"
        placeholder="İl"
        value={formData?.province || ""}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2"
        
      />
      <Input
          name="district"
          placeholder="İlçe"
          value={formData?.district || ""}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2"
        
      />
  
      </div>

      <Select
  name="category"
  value={formData?.category || ""}
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
      <input type="file" multiple onChange={handleImages} className="w-full" />

      <div className="flex justify-end">
        
      <Button
  type="submit"
  variant="primary"
  loading={loading}
  loadingText="Yükleniyor..."
  text={<ArrowRightIcon className="w-4 h-4" />}

  className="p-3"
/>


      </div>
    </form>
  );
};
