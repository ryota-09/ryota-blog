'use client';
import { useTranslations } from 'next-intl';
import ExternalLink from "@/components/UiParts/ExternalLink";
import Image from "next/image";

type IssueButtonProps = {
  currentPath: string;
}

const IssueButton = ({ currentPath }: IssueButtonProps) => {
  const t = useTranslations('blog');
  const bodyText = t('issueTemplate', { url: currentPath });
  const encodedBodyText = encodeURIComponent(bodyText);
  const href = `https://github.com/ryota-09/ryota-blog/issues/new?body=${encodedBodyText}`;
  return (
    <ExternalLink href={href} className="flex gap-4 items-center hover:opacity-70 dark:bg-gray-500 w-full sm:w-1/2  lg:w-1/4 border shadow-md p-4">
      <figure>
        <Image src="/icons/github.webp" alt="GitHub" width={24} height={24} />
      </figure>
      <div className=" text-txt-base dark:text-gray-400 text-center flex-grow">
        {t('requestCorrection')}
      </div>
    </ExternalLink>
  )
}
export default IssueButton;