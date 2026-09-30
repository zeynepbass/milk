import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { NAV_ITEMS } from "./navItems";

export function MobileMenu({ open, onClose, search, onLogout }) {
  return (
    <Dialog open={open} onClose={onClose} className="md:hidden relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <DialogPanel className="fixed inset-y-0 right-0 w-full sm:max-w-sm overflow-y-auto bg-white dark:bg-gray-900 p-6">
        <div className="flex items-center justify-between">
          <DialogTitle className="font-semibold text-gray-700 dark:text-gray-200">Menü</DialogTitle>
          <button type="button" onClick={onClose} aria-label="Menüyü kapat" className="p-2 text-gray-700 dark:text-gray-300">
            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6">{search}</div>

        <nav aria-label="Mobil gezinme" className="mt-6">
          <ul className="space-y-1">
            {[...NAV_ITEMS, { to: "/profil", label: "Profil" }].map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 aria-[current=page]:font-semibold"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={onLogout}
                className="block w-full text-left rounded-lg px-3 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Çıkış yap
              </button>
            </li>
          </ul>
        </nav>
      </DialogPanel>
    </Dialog>
  );
}
