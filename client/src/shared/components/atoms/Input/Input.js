export function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-500 pb-2">
          {label}
        </label>
      )}

      <input
        {...props}
        required
        className={`
          w-full
          px-2
          dark:text-white
          text-sm
          rounded-xl
          border
          outline-none
          border-gray-100
          dark:bg-gray-800
          bg-gray-50
          focus:bg-white
          focus:ring-2
          dark:border-yellow-400
          dark:focus:ring-0
          focus:ring-[rgb(82,144,246)]
          transition-all
          ${className}
        `}
      />

      {error && (
        <p className="text-xs text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}