'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import type { ComponentProps } from 'react';

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

/**
 * Locale-aware Link component that automatically prepends the current locale to the href
 */
export default function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const locale = useLocale();
  
  // 外部リンクまたは絶対URLの場合はそのまま使用
  if (href.startsWith('http') || href.startsWith('//')) {
    return <Link href={href} {...props} />;
  }
  
  // アンカーリンクの場合はそのまま使用
  if (href.startsWith('#')) {
    return <Link href={href} {...props} />;
  }
  
  // localeが既に含まれている場合はそのまま使用
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) {
    return <Link href={href} {...props} />;
  }
  
  // その他の内部リンクにはlocaleを追加
  const localizedHref = href.startsWith('/') ? `/${locale}${href}` : `/${locale}/${href}`;
  
  return <Link href={localizedHref} {...props} />;
}