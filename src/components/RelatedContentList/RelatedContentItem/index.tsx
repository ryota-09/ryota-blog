'use client';

import Chip from "@/components/UiParts/Chip";
import { CATEGORY_MAPED_NAME } from "@/static/blogs";
import { CategoriesContentType } from "@/types/microcms";
import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from 'next-intl';

type RelatedContentItemProps = {
  id: string;
  updatedAt: string;
  title: string;
  category: Pick<CategoriesContentType, "id">[];
  publishedAt?: string;
}

const RelatedContentItem = ({ id, publishedAt, updatedAt, title, category }: RelatedContentItemProps) => {
  const locale = useLocale();
  const t = useTranslations('categories');
  const displayTime = publishedAt || updatedAt;
  const primaryCategoryId = category.length > 0 ? category[0].id : "programming";
  
  return (
    <li>
      <Link href={`/${locale}/blogs/${primaryCategoryId}/${id}`} key={id} className="group transition-opacity hover:opacity-60 flex md:justify-between flex-col gap-1 md:gap-0 md:flex-row items-center py-2">
        <div>
          <time dateTime={displayTime.split('T')[0]} className="text-gray-400 text-sm">{displayTime.split('T')[0].replaceAll("-", "/")}</time>
          <p className="line-clamp-2 md:line-clamp-3 text-txt-base dark:text-gray-300 group-hover:underline group-hover:underline-offset-4 group-hover:decoration-txt-base dark:group-hover:decoration-gray-300">{title}</p>
        </div>
        <ul className="flex flex-wrap items-center gap-1 w-full md:w-auto justify-end">
          {category.map(({ id }) => (
            <li key={id}>
              <Chip label={t(id)} classes="bg-gray-300 dark:bg-gray-600 dark:text-gray-300 px-2 py-0.5 text-xs text-txt-base" />
            </li>
          ))}
        </ul>
      </Link>
    </li>
  )
}
export default RelatedContentItem;