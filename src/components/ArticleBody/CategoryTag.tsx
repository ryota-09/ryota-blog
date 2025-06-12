'use client';

import { Link } from 'next-view-transitions';
import { useLocale } from 'next-intl';
import Chip from '@/components/UiParts/Chip';

type CategoryTagProps = {
  name: string;
  index: number;
};

const CategoryTag = ({ name, index }: CategoryTagProps) => {
  const locale = useLocale();
  
  return (
    <li key={index} className="block cursor-pointer">
      <Link href={`/${locale}/blogs?category=${name}`}>
        <Chip label={`#${name}`} classes="bg-gray-200 dark:bg-gray-600 dark:text-gray-300 px-3 py-2 text-sm text-txt-base hover:opacity-60" />
      </Link>
    </li>
  );
};

export default CategoryTag;