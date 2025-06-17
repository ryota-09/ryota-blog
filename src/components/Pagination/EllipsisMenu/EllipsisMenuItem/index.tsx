"use client";
import { Link } from "next-view-transitions";
import { useSearchParams, usePathname } from "next/navigation";
import { useCallback, type ReactNode } from "react";
import { cltw } from "@/util";

type EllipsisMenuItemProps = {
  pageNumber?: number;
  children: ReactNode;
};

const EllipsisMenuItem = ({ pageNumber, children }: EllipsisMenuItemProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const generateHref = useCallback(() => {
    // 国際化対応: カテゴリページかどうかを確認
    const categoryPathMatch = pathname.match(/^\/([^\/]+)\/blogs\/([^\/]+)$/);
    const locale = categoryPathMatch
      ? categoryPathMatch[1]
      : pathname.match(/^\/([^\/]+)/)?.[1] || "ja";
    const categoryId = categoryPathMatch ? categoryPathMatch[2] : null;

    let baseHref = categoryId
      ? `/${locale}/blogs/${categoryId}`
      : `/${locale}/blogs`;
    const keyword = searchParams?.get("keyword") ?? "";

    if (keyword) {
      const currentPath = `${baseHref}?keyword=${keyword}`;
      return `${currentPath}${pageNumber === 1 ? "" : `&page=${pageNumber}`}`;
    }

    if (pageNumber === 1) {
      return baseHref;
    }

    // 新しいパスベースのページネーション形式を使用
    return `${baseHref}/page/${pageNumber}`;
  }, [searchParams, pathname, pageNumber]);

  return (
    <Link
      href={generateHref()}
      className={cltw(
        "text-md block w-full px-4 py-2 text-left text-txt-base hover:bg-light hover:text-white dark:text-gray-400 dark:hover:bg-secondary",
      )}
      aria-label="ページネーションボタン"
    >
      {children}
    </Link>
  );
};
export default EllipsisMenuItem;
