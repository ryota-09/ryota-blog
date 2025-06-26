'use client';

import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

type CategoryItemProps = {
  /**
   * カテゴリid
   */
  id: string;
  /**
   * カテゴリ名
   */
  categoryName: string;
}

const CategoryItem = ({ id, categoryName }: CategoryItemProps) => {
  const locale = useLocale();
  
  return (
    <li className="flex items-center justify-center md:justify-start gap-2">
      <Link href={`/blogs/${id}`} className="md:w-full h-full p-2 md:p-4 block text-white md:text-txt-base dark:md:text-gray-500 text-md leading-tight font-medium bg-secondary md:bg-transparent rounded-full md:rounded-none transition duration-200 hover:text-base-color dark:md:hover:text-primary dark:hover:text-gray-100 dark:hover:opacity-90" data-testid={`pw-category-list-${id}`}>
        <p>{categoryName}</p>
      </Link>
    </li>
  )
}
export default CategoryItem;