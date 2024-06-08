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
    href: 'https://docs.google.com/forms/d/1RP2EUWjYvEa2gwFd0bjFurmZxUFCfvxtwxqpm6ggO68/viewform?edit_requested=true',
    target: "_blank",
  },
  {
    name: "RSS",
    href: "/feed",
  }
] as const;