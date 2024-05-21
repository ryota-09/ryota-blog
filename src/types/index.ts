export type TOCAssetsType = {
  id: string;
  text: string;
  subList: H3TOCAssetsType[];
}

export type H3TOCAssetsType = {
  id: string;
  text: string;
}

export type BreadcrumbItemType = {
  label: string;
  href: string;
}

export const BLOG_TYPE_ASSETS = {
  blogs: "Blogs",
  zenn: "Zenn",
} as const;

export type BlogAssetsLiteralType = typeof BLOG_TYPE_ASSETS[keyof typeof BLOG_TYPE_ASSETS];
export type BlogTypeKeyLIteralType = keyof typeof BLOG_TYPE_ASSETS;