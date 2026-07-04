'use client';

import { Link } from 'next-view-transitions';
import { useLocale } from 'next-intl';
import Chip from '@/components/UiParts/Chip';
import { getLocalizedCategoryName } from '@/lib/i18n-utils';
import { resolveCategoryOrDefault } from '@/static/categories';

type CategoryTagProps = {
  id: string;
  index: number;
};

const CategoryTag = ({ id, index }: CategoryTagProps) => {
  const locale = useLocale();

  const categoryEntry = resolveCategoryOrDefault(id);
  const categorySlug = categoryEntry.slug;
  const localizedName = getLocalizedCategoryName(categoryEntry, locale);

  return (
    <li key={index} className="block cursor-pointer">
      <Link href={`/${locale}/blogs/${categorySlug}`}>
        <Chip label={`#${localizedName}`} classes="bg-gray-200 dark:bg-gray-600 dark:text-gray-300 px-3 py-2 text-sm text-txt-base hover:opacity-60" />
      </Link>
    </li>
  );
};

export default CategoryTag;