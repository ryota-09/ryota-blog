'use client';

import { Link } from 'next-view-transitions';
import { useLocale } from 'next-intl';

type PropsType = {
  title: string;
}

const LocaleAwareBlogTitle = ({ title }: PropsType) => {
  const locale = useLocale();
  
  return (
    <Link href={`/${locale}/blogs`}>
      <h1 className="text-md md:text-xl font-bold text-black dark:text-gray-400 transition duration-200 hover:text-base-color shrink-0">{title}</h1>
    </Link>
  )
}
export default LocaleAwareBlogTitle;