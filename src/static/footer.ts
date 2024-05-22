import type { FooterNavItem } from "@/types/footer";

export const FOOTER_NAV_ITEMS: FooterNavItem[] = [
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
  {
    name: "Feed",
    href: "/feed",
  }
] as const;