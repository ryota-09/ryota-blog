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
    href: 'https://docs.google.com/forms/d/1RP2EUWjYvEa2gwFd0bjFurmZxUFCfvxtwxqpm6ggO68/viewform',
    target: "_blank",
  },
] as const;

export const SOCIAL_MEDIA_NAV_ITEMS: HeaderNavItem[] = [
  {
    name: 'X',
    href: 'https://x.com/Ryo54388667',
    icon: '/icons/x.svg',
    target: "_blank",
  },
  {
    name: 'Zenn',
    href: 'https://zenn.dev/ryota_09',
    icon: '/icons/zenn.svg',
    target: "_blank",
  },
  {
    name: 'GitHub',
    href: "https://github.com/ryota-09",
    icon: '/icons/github.svg',
    target: "_blank",
  },
  {
    name: "Feed",
    href: "/feed",
    icon: "/icons/rss.svg",
    target: "_self",
  }
] as const;