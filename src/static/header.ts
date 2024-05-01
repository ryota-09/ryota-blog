import type { HeaderNavItem } from "@/types/header";

export const BLOG_TITLE = 'りょたぶろぐ - ゆる開発LIFE -';

export const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  {
    name: 'Home',
    href: '/',
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