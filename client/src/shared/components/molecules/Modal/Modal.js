import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-3xl",
};

export function Modal({ open, onClose, title, size = "md", children }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className={`w-full ${SIZES[size]} max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-6`}
        >
          <div className="flex items-start justify-between mb-4">
            <DialogTitle className="text-lg font-semibold text-gray-700 dark:text-gray-100">{title}</DialogTitle>
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="p-1 rounded-full text-gray-500 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              <XMarkIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
