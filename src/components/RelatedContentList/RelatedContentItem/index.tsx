'use client';

import Chip from "@/components/UiParts/Chip";
import { getLocalizedCategoryName } from "@/lib/i18n-utils";
import { resolveCategoryOrDefault } from "@/static/categories";
import { Link } from "next-view-transitions";
import { useLocale } from 'next-intl';

type RelatedContentItemProps = {
  id: string;
  updatedAt: string;
  title: string;
  // BlogPost.categories相当(カテゴリslugの配列。先頭がプライマリ)
  categories: string[];
  publishedAt?: string;
}

const RelatedContentItem = ({ id, publishedAt, updatedAt, title, categories }: RelatedContentItemProps) => {
  const locale = useLocale();
  const displayTime = publishedAt || updatedAt;
  const primaryCategoryId = resolveCategoryOrDefault(categories[0]).slug;

  return (
    <li>
      <Link href={`/${locale}/blogs/${primaryCategoryId}/${id}`} key={id} className="group transition-opacity hover:opacity-60 flex md:justify-between flex-col gap-1 md:gap-0 md:flex-row items-center py-2">
        <div>
          {/* NOTE: このリストはページ背景(#eee)の上に直接載るため、gray-500では4.16:1と
              AA(4.5:1)に僅かに届かない。gray-600(#eee上で約6.5:1)を使う */}
          <time dateTime={displayTime.split('T')[0]} className="text-gray-600 dark:text-gray-400 text-sm">{displayTime.split('T')[0].replaceAll("-", "/")}</time>
          <p className="line-clamp-2 md:line-clamp-3 text-txt-base dark:text-gray-300 group-hover:underline group-hover:underline-offset-4 group-hover:decoration-txt-base dark:group-hover:decoration-gray-300">{title}</p>
        </div>
        <ul className="flex flex-wrap items-center gap-1 w-full md:w-auto justify-end">
          {categories.map((categoryId) => {
            const entry = resolveCategoryOrDefault(categoryId);
            return (
              <li key={categoryId}>
                <Chip label={getLocalizedCategoryName(entry, locale)} classes="bg-gray-300 dark:bg-gray-600 dark:text-gray-300 px-2 py-0.5 text-xs text-txt-base" />
              </li>
            );
          })}
        </ul>
      </Link>
    </li>
  )
}
export default RelatedContentItem;