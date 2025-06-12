import type { FooterNavItem } from "@/types/footer";

// locale依存のパスを生成する関数
export const getFooterNavItems = (locale: string): FooterNavItem[] => [
  {
    name: 'Home',
    href: `/${locale}/blogs`,
  },
  {
    name: 'About',
    href: `/${locale}/about`,
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
    href: `/${locale}/feed`,
  },
  {
    name: "llms.txt",
    href: `/${locale}/docs/llms.txt`,
  }
] as const;

// 後方互換性のため、デフォルトのエクスポートも残す（localeなしのパス）
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
  },
  {
    name: "llms.txt",
    href: "/docs/llms.txt",
  }
];