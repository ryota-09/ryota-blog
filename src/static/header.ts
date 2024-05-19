import type { HeaderNavItem } from "@/types/header";

export const BLOG_TITLE = 'りょたぶろぐ - ゆる開発らいふ -';

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
    href: '/contact',
  },
] as const;

export const SOCIAL_MEDIA_NAV_ITEMS: HeaderNavItem[] = [
  {
    name: 'X',
    href: 'https://x.com/Ryo54388667',
  },
  {
    name: 'Z',
    href: 'https://zenn.dev/ryota_09',
  },
  {
    name: 'G',
    href: "https://github.com/ryota-09"
  },
] as const;