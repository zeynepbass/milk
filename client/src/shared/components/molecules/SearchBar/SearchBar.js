import { useId, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function Search({ initialValue = "", onSearch }) {
  const [value, setValue] = useState(initialValue);
  const inputId = useId();

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl mx-auto rounded-full bg-gray-50 border-2 border-[rgb(137,205,251)] dark:border-yellow-400 dark:bg-gray-800 overflow-hidden h-10"
    >
      <label htmlFor={inputId} className="sr-only">
        Ürün ara
      </label>
      <input
        id={inputId}
        type="search"
        value={value}
        placeholder="Ürün, kategori, ilçe ara…"
        onChange={(event) => setValue(event.target.value)}
        className="flex-1 bg-transparent px-4 text-sm outline-none dark:text-white"
      />
      <button
        type="submit"
        aria-label="Ara"
        className="flex items-center justify-center px-6 bg-[rgb(137,205,251)] dark:bg-yellow-400 hover:opacity-90"
      >
        <MagnifyingGlassIcon className="w-5 h-5 text-white" aria-hidden="true" />
      </button>
    </form>
  );
}
