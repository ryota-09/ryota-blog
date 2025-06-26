'use client';

import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Chip from '@/components/UiParts/Chip';
import { CATEGORY_MAPED_ID } from '@/static/blogs';

type CategoryTagProps = {
  name: string;
  index: number;
};

const CategoryTag = ({ name, index }: CategoryTagProps) => {
  const locale = useLocale();
  const t = useTranslations('categories');
  
  // カテゴリ名から対応するIDを取得
  const categoryId = CATEGORY_MAPED_ID[name as keyof typeof CATEGORY_MAPED_ID] || 'programming';
  const localizedName = t(categoryId);
  
  return (
    <li key={index} className="block cursor-pointer">
      <Link href={`/${locale}/blogs/${categoryId}`}> 
        <Chip label={`#${localizedName}`} classes="bg-gray-200 dark:bg-gray-600 dark:text-gray-300 px-3 py-2 text-sm text-txt-base hover:opacity-60" />
      </Link>
    </li>
  );
};

export default CategoryTag;