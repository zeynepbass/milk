import {
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  HeartIcon,
  HomeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export const NAV_ITEMS = [
  { to: "/", label: "Akış", icon: HomeIcon, end: true },
  { to: "/kesfet", label: "Keşfet", icon: GlobeAltIcon },
  { to: "/favoriler", label: "Kaydedilenler", icon: HeartIcon },
  { to: "/mesajlar", label: "Mesajlar", icon: ChatBubbleLeftRightIcon },
];

export const ADMIN_NAV_ITEM = { to: "/yonetim", label: "Yönetim", icon: ShieldCheckIcon };

export const navItemsFor = (user) => (user?.role === "admin" ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS);
