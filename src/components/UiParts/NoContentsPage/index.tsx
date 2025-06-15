'use client';

import Image from "next/image";
import BackToTopLink from "./BackToTopLink";
import { useTranslations } from 'next-intl';

const NoContents = () => {
  const t = useTranslations('error');
  
  return (
    <div className="h-full bg-white dark:bg-black border-2 border-gray-200 dark:dark:border-gray-600 py-4 px-4 flex flex-col md:flex-row justify-center items-center" data-testid="pw-no-content-page">
      <Image src="/no_contents.png" alt="No contents" width={300} height={300} sizes="100vw" style={{ width: '60%', height: 'auto' }} className="max-h-[500px]" />
      <div className="flex flex-col gap-8">
        <p className="dark:text-gray-400 text-center md:text-left">{t('noContent.message')}</p>
        <div className="flex justify-center md:justify-start">
          <BackToTopLink />
        </div>
      </div>
    </div>
  );
}
export default NoContents;