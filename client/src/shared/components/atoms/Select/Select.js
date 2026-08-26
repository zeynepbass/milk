import { ChevronDownIcon } from "@heroicons/react/16/solid";

export function Select({
  label,
  options = [],
  placeholder = "Seçim yapınız",
  className = "",
  ...props
}) {
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm text-gray-500 pb-2">
          {label}
        </label>
      )}

      <select
        {...props}
        className={`w-full appearance-none rounded-lg border border-gray-200
        px-4 py-2 text-sm text-gray-500 focus:outline-none
        focus:ring-2 focus:ring-[rgb(82,144,246)] transition
        ${className}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <ChevronDownIcon className="pointer-events-none absolute right-3 top-9 h-5 w-5 text-gray-400" />
    </div>
  );
}