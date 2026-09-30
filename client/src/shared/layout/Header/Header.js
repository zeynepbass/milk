import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Search } from "@/shared/components/molecules";
import { useSearchStore } from "@/shared/store/useSearchStore";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLogout } from "@/features/auth/hooks/useAuthActions";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { NAV_ITEMS } from "./navItems";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";

const NAV_LINK_CLASS =
  "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-[rgb(40,100,210)] dark:text-yellow-400 aria-[current=page]:bg-blue-50 dark:aria-[current=page]:bg-gray-800 focus-visible:outline-2 focus-visible:outline-blue-500";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const search = useSearchStore((state) => state.search);
  const setSearch = useSearchStore((state) => state.setSearch);
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleSearch = (value) => {
    setSearch(value);
    setMobileMenuOpen(false);
    navigate("/kesfet");
  };

  const searchBox = <Search initialValue={search} onSearch={handleSearch} />;

  return (
    <header className="w-full border-b-2 border-b-gray-200 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-4 lg:px-8">
        <Link to="/" className="shrink-0 rounded focus-visible:outline-2 focus-visible:outline-blue-500">
          <img
            src="/assets/logo-sm.png"
            width="116"
            height="128"
            alt="Milk ana sayfa"
            className="h-14 w-auto block dark:hidden"
          />
          <img
            src="/assets/dark-logo-sm.png"
            width="128"
            height="128"
            alt="Milk ana sayfa"
            className="h-14 w-auto hidden dark:block"
          />
        </Link>

        <div className="hidden md:flex flex-1 mx-3">{searchBox}</div>

        <nav aria-label="Ana gezinme" className="hidden md:flex shrink-0 items-center gap-2">
          <ThemeToggle />
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} aria-label={label} title={label} className={NAV_LINK_CLASS}>
              <Icon className="w-5 h-5" aria-hidden="true" />
            </NavLink>
          ))}
          <NotificationBell />
          <UserMenu user={user} onLogout={() => logout.mutate()} />
        </nav>

        <div className="flex md:hidden items-center gap-2">
          <NotificationBell />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Menüyü aç"
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-md text-gray-700 dark:text-gray-300"
          >
            <Bars3Icon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        search={searchBox}
        onLogout={() => logout.mutate()}
      />
    </header>
  );
}
