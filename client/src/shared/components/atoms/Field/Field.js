import { useId } from "react";

export const FIELD_VARIANTS = {
  default: "border-gray-200 dark:border-yellow-400 focus:ring-blue-600",
  error: "border-red-400 dark:border-red-400 focus:ring-red-400",
  ghost: "border-transparent bg-transparent dark:bg-transparent",
};

export const FIELD_BASE_CLASS =
  "w-full px-3 dark:text-white text-sm rounded-xl border outline-none dark:bg-gray-800 bg-gray-50 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 transition-all";

export function useFieldIds(id) {
  const generated = useId();
  const fieldId = id ?? generated;
  return { fieldId, errorId: `${fieldId}-error` };
}

export function Field({ label, error, fieldId, errorId, children, className = "" }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={fieldId} className="block text-sm font-medium text-gray-600 dark:text-gray-300 pb-2">
          {label}
        </label>
      )}

      {children}

      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export const fieldAccessibility = ({ error, errorId }) => ({
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? errorId : undefined,
});
