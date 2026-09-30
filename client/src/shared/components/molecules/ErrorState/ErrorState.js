import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/shared/components/atoms";

export function ErrorState({ title = "İçerik yüklenemedi", description, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center text-center py-16 px-4">
      <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mb-3" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h2>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{description}</p>}
      {onRetry && (
        <Button type="button" variant="primary" className="mt-4" onClick={onRetry}>
          Tekrar dene
        </Button>
      )}
    </div>
  );
}
