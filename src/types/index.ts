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