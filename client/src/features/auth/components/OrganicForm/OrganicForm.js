import { useState } from "react";
import {
  ArrowRightIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { Heading, Button } from "@/shared/components/atoms";

export function OrganicForm() {
  const [file, setFile] = useState(null);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) return;

    toast.info("Belge inceleme süreci henüz aktif değil, yakında buradan başvurabileceksiniz.");
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-400 space-y-6">
      <Heading
        title="Organik Form Yükleyin"
        desc="Hesabınızı doğrulanmış satıcı olarak kullanmak için PDF belgenizi yükleyin."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          className="
            flex flex-col items-center justify-center
            border-2 border-dashed rounded-xl p-6
            cursor-pointer transition
            hover:border-blue-400 dark:hover:border-gray-500
          "
        >
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
            variant="primary"
            icon={ArrowRightIcon}
            loadingText="Gönderiliyor..."
          />
        </div>
      </form>
    </div>
  );
}