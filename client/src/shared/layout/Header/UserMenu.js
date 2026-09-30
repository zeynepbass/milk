import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "react-router-dom";
import { Avatar } from "@/shared/components/atoms";

const ITEM_CLASS =
  "block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-yellow-400 data-focus:bg-gray-100 dark:data-focus:bg-gray-700";

export function UserMenu({ user, onLogout }) {
  return (
    <Menu as="div" className="relative">
      <MenuButton
        aria-label="Kullanıcı menüsü"
        className="flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        <Avatar user={user} />
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className="z-50 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg outline outline-black/5"
      >
        <MenuItem>
          <Link to="/profil" className={ITEM_CLASS}>
            Profil
          </Link>
        </MenuItem>
        <MenuItem>
          <button type="button" onClick={onLogout} className={ITEM_CLASS}>
            Çıkış yap
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
