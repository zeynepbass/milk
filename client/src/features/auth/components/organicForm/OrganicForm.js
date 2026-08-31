import { useState } from "react";
import { ArrowRightIcon, DocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Heading,Button } from "@/shared/components/atoms";

export function OrganicForm({ handleUpdated }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await handleUpdated(formData);
      setFile("")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full p-6 bg-white dark:bg-gray-800  dark:border-gray-400  rounded-2xl shadow-lg border space-y-6">
 <Heading title="          Organik Form Yükleyin" desc="  Hesabınızı doğrulanmış satıcı olarak kullanmak için PDF belgenizi yükleyin."/>


      <form onSubmit={handleSubmit} className="space-y-4">

        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer
        dark:hover:border-gray-500
        hover:border-blue-400 transition">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="hidden"
          />

          <DocumentIcon className="w-10 h-10 text-gray-400 mb-2" />

          <p className="text-sm text-gray-500">
            PDF dosyanızı seçmek için tıklayın
          </p>
          <p className="text-xs text-gray-400 mt-1">
            (Sadece .pdf formatı desteklenir)
          </p>
        </label>


        {file && (
          <div className="flex items-center justify-between border rounded-lg px-4 py-2 bg-gray-50">
            <span className="text-sm text-gray-700 truncate">
              {file.name}
            </span>

            <Button
  type="button"
  onClick={removeFile}
  icon={XMarkIcon}
    variant="danger"
/>
          </div>
        )}


        <div className="flex justify-end">
        <Button
  type="submit"
  disabled={!file}
  loading={loading}
  variant="primary"
  text={<ArrowRightIcon className="w-4 h-4" />}
  loadingText="Gönderiliyor..."
/>



        </div>
      </form>
    </div>
  );
}