'use client';

import { Link } from "next-view-transitions";
import { useLocale } from 'next-intl';

const BackToTopLink = () => {
  const locale = useLocale();
  
  return (
    <Link href={`/${locale}/blogs`} className="text-base-color border-2 border-base-color w-fit px-4 py-2 hover:bg-base-color hover:text-white hover:border-base-color transition duration-200">
      トップページに戻る
    </Link>
  );
};

export default BackToTopLink;