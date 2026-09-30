import { ChatBubbleLeftRightIcon, GlobeAltIcon, HeartIcon, HomeIcon } from "@heroicons/react/24/outline";

export const NAV_ITEMS = [
  { to: "/", label: "Akış", icon: HomeIcon, end: true },
  { to: "/kesfet", label: "Keşfet", icon: GlobeAltIcon },
  { to: "/favoriler", label: "Kaydedilenler", icon: HeartIcon },
  { to: "/mesajlar", label: "Mesajlar", icon: ChatBubbleLeftRightIcon },
];
