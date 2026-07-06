'use client';

import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from 'next-intl';

import type { BlogPost } from "@/types/content";
import { cltw } from "@/util";
import { getPrimaryCategoryIdFromBlogPost } from "@/lib/content";

type PrevAndNextBlogNavItemProps = {
  role: "prev" | "next"
  data: Pick<BlogPost, "slug" | "title" | "publishedAt" | "updatedAt" | "categories">
}

const PrevAndNextBlogNavItem = ({ role, data }: PrevAndNextBlogNavItemProps) => {
  const locale = useLocale();
  const t = useTranslations('blog');
  const displayTime = data.publishedAt || data.updatedAt;
  const categoryId = getPrimaryCategoryIdFromBlogPost(data);

  return (
    <Link href={`/${locale}/blogs/${categoryId}/${data.slug}`} className={cltw("max-w-1/2 py-4 transition text-gray-400 dark:text-gray-500 underline underline-offset-4 hover:opacity-70 hover:text-base-color hover:no-underline", role === "prev" ? "text-left" : "text-right")}>
      <span>{role === "prev" ? t('previousArticle') : t('nextArticle')}</span><br className="inline sm:hidden" />
      <time dateTime={displayTime.split('T')[0]}>({displayTime.split('T')[0]})</time><br />
      <span className="line-clamp-2 sm:line-clamp-1">{data.title}</span>
    </Link>
  )
}
export default PrevAndNextBlogNavItem;