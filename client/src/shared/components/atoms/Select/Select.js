
export function Select({
  label,
  options = [],
  placeholder = "Seçim yapınız",
  error,
  variant = "default",
  className = "",
  ...props
}) {
  const variants = {
    default: "border-gray-100 dark:border-yellow-400 focus:ring-[rgb(82,144,246)]",
    error: "border-red-400 dark:border-red-400 focus:ring-red-400",
    ghost: "border-transparent bg-transparent dark:bg-transparent",
  };

  const appliedVariant = error ? "error" : variant;

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm text-gray-500 pb-2">
          {label}
        </label>
      )}

      <select
        {...props}
        className={`w-full px-2 py-2  dark:text-white text-sm rounded-xl border outline-none dark:bg-gray-800 bg-gray-50 focus:bg-white focus:ring-2 dark:focus:ring-0 transition-all ${variants[appliedVariant] || variants.default} ${className}`}
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

      {error && (
        <p className="text-xs text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}