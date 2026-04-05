import { useState } from "react";
import { ArrowRightIcon, DocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function OrganicForm({ userUpdated }) {
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
      await userUpdated(formData);
      setFile("")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full p-6 bg-white rounded-2xl shadow-lg border space-y-6">

      <div>
      <h3 className="text-md font-semibold text-gray-700 mb-2">
          Organik Form Yükleyin
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Hesabınızı doğrulanmış satıcı olarak kullanmak için PDF belgenizi yükleyin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-blue-400 transition">
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

            <button
              type="button"
              onClick={removeFile}
              className="text-gray-500 hover:text-red-500"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        )}


        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!file || loading}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ?  "Gönderiliyor..." :  <ArrowRightIcon className="w-4 h-4" /> }
          </button>
        </div>
      </form>
    </div>
  );
}