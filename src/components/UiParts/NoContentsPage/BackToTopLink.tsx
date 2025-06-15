'use client';

import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from 'next-intl';

const BackToTopLink = () => {
  const locale = useLocale();
  const t = useTranslations('error');
  
  return (
    <Link href={`/${locale}/blogs`} className="text-base-color border-2 border-base-color w-fit px-4 py-2 hover:bg-base-color hover:text-white hover:border-base-color transition duration-200">
      {t('noContent.backToHome')}
    </Link>
  );
};

export default BackToTopLink;