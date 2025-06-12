'use client';

import { useLocale } from 'next-intl';
import XShareButton from "@/components/UiParts/XShareButton";
import { baseURL } from "@/config";

type LocaleAwareShareProps = {
  categoryId: string;
  blogId: string;
  title: string;
};

const LocaleAwareShare = ({ categoryId, blogId, title }: LocaleAwareShareProps) => {
  const locale = useLocale();
  
  return (
    <XShareButton url={`${baseURL}/${locale}/blogs/${categoryId}/${blogId}`} text={title}>
      Post to X
    </XShareButton>
  );
};

export default LocaleAwareShare;