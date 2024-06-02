import type { HeaderNavItem } from "@/types/header";

export const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  {
    name: 'Home',
    href: '/blogs',
  },
  {
    name: 'About',
    href: '/about',
  },
  {
    name: 'Contact',
    href: 'https://docs.google.com/forms/d/1RP2EUWjYvEa2gwFd0bjFurmZxUFCfvxtwxqpm6ggO68/viewform?edit_requested=true',
    target: "_blank",
  },
] as const;

export const SOCIAL_MEDIA_NAV_ITEMS: HeaderNavItem[] = [
  {
    name: 'X',
    href: 'https://x.com/Ryo54388667',
    target: "_blank",
  },
  {
    name: 'Z',
    href: 'https://zenn.dev/ryota_09',
    target: "_blank",
  },
  {
    name: 'G',
    href: "https://github.com/ryota-09",
    target: "_blank",
  },
] as const;