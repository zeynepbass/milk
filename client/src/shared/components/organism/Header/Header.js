import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  PopoverGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

import {
  Bars3Icon,
  GlobeAltIcon,
  XMarkIcon,
  BellAlertIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import {Search} from "@/shared/components/molecules"
import { Input, Button } from "@/shared/components/atoms";
import {useSearchStore } from "@/shared/store/useSearchStore";
import { useUserStore } from "@/shared/store/useUserStore";
import useUserLogin from "@/features/auth/hooks/useUser";
import {Notification} from "@/features/feed/pages/notification";
import { Link } from "react-router-dom";
import { useTheme } from "@/shared/utils/useTheme";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [input, setInput] = useState("");
  const [bellOpen, setBellOpen] = useState(false);

  const setSearch = useSearchStore((state) => state.setSearch);
  const user = useUserStore((state) => state.user);

  const { profileForm } = useUserLogin();

  return (
    <header className="w-full mx-auto border-b-2 border-b-gray-200 dark:border-gray-800 dark:bg-gray-900 transition-colors">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >

        <div className="shrink-0">
          <Link to="/" className="-m-1.5 p-1.5">
          <img
  src="/assets/logo.png"
  alt="Logo"
  className="h-16 w-auto block dark:hidden outline-none"
/>

            <img
              src="/assets/dark-logo.png"
              alt="Logo Dark"
className="h-16 w-auto hidden dark:block"
            />
          </Link>
        </div>


        <div className="flex md:hidden">
          <Button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
          >
            <span className="sr-only">Open main menu</span>

            <Bars3Icon
              className="w-6 h-6"
              aria-hidden="true"
            />
          </Button>
        </div>


        <PopoverGroup className="hidden md:flex flex-1 mx-3">
         <Search input={input}setSearch={setSearch}setInput={setInput}/>
        </PopoverGroup>


        <div className="hidden md:flex shrink-0 items-center gap-4">


          <Button
            type="button"
            onClick={toggleTheme}
            variant="dark"

          >
            {theme === "light" ? (
              <MoonIcon className="w-5 h-5 text-[rgb(137,205,251)]" />
            ) : (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            )}
          </Button>


          <Link
            to="/kesfet"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <GlobeAltIcon className="w-5 h-5 text-[rgb(137,205,251)] dark:text-yellow-400" />
          </Link>


          <Link
            to="/favoriler"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <HeartIcon className="w-5 h-5 text-[rgb(137,205,251)] dark:text-yellow-400" />
          </Link>


          <Link
            to="/mesajlar"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-[rgb(137,205,251)] dark:text-yellow-400" />
          </Link>


          <Button
            type="button"
            onClick={() => setBellOpen(!bellOpen)}
            variant="dark"

          >
            <BellAlertIcon className="w-5 h-5 text-[rgb(137,205,251)] dark:text-yellow-400" />
          </Button>

          {bellOpen && <Notification open={bellOpen} />}

   
          <Menu as="div" className="relative ml-3">
            <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              <span className="absolute -inset-1.5" />

              <span className="sr-only">Menü</span>

              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                {user?.avatar ? (
                  <img
                    src={user?.avatar || profileForm?.avatar}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-gray-400">
                    {user?.name?.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </MenuButton>

            <MenuItems
              transition
              className="
                absolute right-0 z-10 mt-2 w-48 origin-top-right
                rounded-md bg-white dark:bg-gray-800 py-1
                shadow-lg outline outline-black/5
                transition
                data-closed:scale-95
                data-closed:transform
                data-closed:opacity-0
                data-enter:duration-100
                data-enter:ease-out
                data-leave:duration-75
                data-leave:ease-in
              "
            >
              <MenuItem>
                <Link
                  to="/profil"
                  className="
                    block px-4 py-2 text-sm
                    text-gray-700 dark:text-yellow-400
                    data-focus:bg-gray-100
                    data-focus:outline-hidden
                  "
                >
                  Profil
                </Link>
              </MenuItem>

              <MenuItem>
                <Link
                  to="/giris-yap"
                  onClick={() => localStorage.clear()}
                  className="
                    block px-4 py-2 text-sm
                    text-gray-700 dark:text-yellow-400
                    data-focus:bg-gray-100
                    data-focus:outline-hidden
                  "
                >
                  Çıkış yap
                </Link>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </nav>


      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="md:hidden"
      >
        <div className="fixed inset-0 z-50" />

        <DialogPanel
          className="
            fixed inset-y-0 right-0 z-50
            w-full overflow-y-auto
            bg-white dark:bg-gray-900
            p-6 sm:max-w-sm
            sm:ring-1 sm:ring-gray-900/10
          "
        >

          <div className="flex items-center justify-between">
            <Button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="
                -m-2.5 rounded-md p-2.5
                text-gray-700 dark:text-gray-300
              "
            >
              <span className="sr-only">Close menu</span>

              <XMarkIcon
                className="w-6 h-6"
                aria-hidden="true"
              />
            </Button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">


              <div className="flex py-6 shrink-0 items-center justify-center gap-4">

  
                <Button
                  type="button"
                  onClick={toggleTheme}
                  className="
                    p-2 rounded-full
                    hover:bg-gray-100
                    dark:hover:bg-gray-800
                  "
                >
                  {theme === "light" ? (
                    <MoonIcon className="w-5 h-5 text-[rgb(137,205,251)]" />
                  ) : (
                    <SunIcon className="w-5 h-5 text-yellow-400" />
                  )}
                </Button>

 
                <Link
                  to="/kesfet"
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <GlobeAltIcon className="w-5 h-5 text-[rgb(137,205,251)] dark:text-yellow-400" />
                </Link>


                <Link
                  to="/favoriler"
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <HeartIcon className="w-5 h-5 text-[rgb(137,205,251)] dark:text-yellow-400" />
                </Link>

         
                <Link
                  to="/mesajlar"
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-[rgb(137,205,251)] dark:text-yellow-400" />
                </Link>


                <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                    <span className="absolute -inset-1.5" />

                    <span className="sr-only">Menü</span>

                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user?.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 font-bold">
                          {user?.name?.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </MenuButton>

                  <MenuItems
                    transition
                    className="
                      absolute right-0 z-10 mt-2 w-48
                      origin-top-right rounded-md
                      bg-white dark:bg-gray-800 py-1
                      shadow-lg outline outline-black/5
                      transition
                      data-closed:scale-95
                      data-closed:transform
                      data-closed:opacity-0
                      data-enter:duration-100
                      data-enter:ease-out
                      data-leave:duration-75
                      data-leave:ease-in
                    "
                  >
                    <MenuItem>
                      <Link
                        to="/profil"
                        className="
                          block px-4 py-2 text-sm
                          text-gray-700 dark:text-yellow-400
                          data-focus:bg-gray-100
                        "
                      >
                        Profil
                      </Link>
                    </MenuItem>

                    <MenuItem>
                      <Link
                        to="/ayarlar"
                        className="
                          block px-4 py-2 text-sm
                          text-gray-700 dark:text-yellow-400
                          data-focus:bg-gray-100
                        "
                      >
                        Ayarlar
                      </Link>
                    </MenuItem>

                    <MenuItem>
                      <Link
                        to="/giris-yap"
                        className="
                          block px-4 py-2 text-sm
                          text-gray-700 dark:text-yellow-400
                          data-focus:bg-gray-100
                        "
                      >
                        Çıkış yap
                      </Link>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>


              <div className="space-y-2 py-6">

                        <Search input={input}
                        setSearch={setSearch}
                        setInput={setInput}
    
                       />
         
      
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}