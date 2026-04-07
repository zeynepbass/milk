export default function Input({
    label,
    error,
    ...props
  }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-500 pb-2">
          {label}
        </label>
  
        <input
          {...props}
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)] transition"
        />
  
        {error && (
          <p className="text-xs text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  }