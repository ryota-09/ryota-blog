import type { FooterNavItem } from "@/types/footer";

export const FOOTER_NAV_ITEMS: FooterNavItem[] = [
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
  {
    name: "Storybook",
    href: "https://story.ryotablog.jp/?path=/docs/document--docs",
    target: "_blank",
  },
  {
    name: "RSS",
    href: "/feed",
  }
] as const;