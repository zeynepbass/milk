import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useThemeStore } from "@/shared/store/useThemeStore";

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
      aria-pressed={isDark}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-blue-500"
    >
      {isDark ? (
        <SunIcon className="w-5 h-5 text-yellow-400" aria-hidden="true" />
      ) : (
        <MoonIcon className="w-5 h-5 text-[rgb(40,100,210)]" aria-hidden="true" />
      )}
    </button>
  );
}
