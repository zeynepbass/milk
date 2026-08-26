export function Textarea({ label, error, ...props }) {
    return (
      <div>
        {label && (
          <label className="block text-sm text-gray-500 pb-2">
            {label}
          </label>
        )}
  
        <textarea
          {...props}
          className="w-full p-3 rounded-lg border border-gray-300
          dark:bg-gray-700 dark:border-gray-600 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-blue-300
          resize-none transition"
          required
        />
  
        {error && (
          <p className="text-xs text-red-400 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }