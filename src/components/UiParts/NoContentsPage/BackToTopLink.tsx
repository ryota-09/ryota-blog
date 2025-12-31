'use client';

import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from 'next-intl';
import { cltw } from '@/util';

type BackToTopLinkProps = {
  /**
   * 戻り先のパス（localeなし）
   */
  returnPath?: string;
  /**
   * ブログタイプ（Zennモード時の色変更用）
   */
  blogType?: "blogs" | "zenn";
}

const BackToTopLink = ({ returnPath = "/blogs", blogType = "blogs" }: BackToTopLinkProps) => {
  const locale = useLocale();
  const t = useTranslations('error');
  const isZennMode = blogType === "zenn";

  return (
    <Link
      href={`/${locale}${returnPath}`}
      className={cltw(
        "w-fit px-4 py-2 border-2 transition duration-200 hover:text-white",
        isZennMode
          ? "text-zenn border-zenn hover:bg-zenn hover:border-zenn"
          : "text-base-color border-base-color hover:bg-base-color hover:border-base-color"
      )}
    >
      {t('noContent.backToHome')}
    </Link>
  );
};

export default BackToTopLink;