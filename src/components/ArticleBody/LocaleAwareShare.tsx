'use client';

import { useLocale, useTranslations } from 'next-intl';
import XShareButton from "@/components/UiParts/XShareButton";
import { baseURL } from "@/config";

type LocaleAwareShareProps = {
  categoryId: string;
  blogId: string;
  title: string;
};

const LocaleAwareShare = ({ categoryId, blogId, title }: LocaleAwareShareProps) => {
  const locale = useLocale();
  const t = useTranslations('blog');
  
  return (
    <div className="fixed z-50 bottom-4 left-4">
      <XShareButton 
        url={`${baseURL}/${locale}/blogs/${categoryId}/${blogId}`} 
        text={title}
        classes="bg-gray-700 text-white p-2 rounded-lg shadow-lg hover:bg-gray-600 transition-colors duration-300 h-12 w-auto flex items-center justify-center"
      >
        {t('shareOnX')}
      </XShareButton>
    </div>
  );
};

export default LocaleAwareShare;