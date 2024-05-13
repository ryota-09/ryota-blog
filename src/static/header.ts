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