
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
        className={`w-full px-2 py-2  dark:text-white text-sm rounded-xl border outline-none border-gray-100 dark:bg-gray-800 bg-gray-50 focus:bg-white focus:ring-2 dark:border-yellow-400 dark:focus:ring-0 focus:ring-[rgb(82,144,246)] transition-all ${className}`}
        required
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


    </div>
  );
}