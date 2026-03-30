import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
export function OrganicForm  ({ userUpdated }) {
  const [file, setFile] = useState(null);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    userUpdated(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full mx-auto p-8 ">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFile}
          className="w-full"
        />

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-[rgb(137,205,251)] text-white p-3 rounded-full"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
