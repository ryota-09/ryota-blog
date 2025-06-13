'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { locales, type Locale } from '@/i18n/config';
import { getAlternateLocaleUrl } from '@/lib/i18n-utils';

const LOCALE_NAMES: Record<Locale, string> = {
  ja: '日本語',
  en: 'English'
} as const;

const LOCALE_FLAGS: Record<Locale, string> = {
  ja: '🇯🇵',
  en: '🇺🇸'
} as const;

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);

  // 外部クリック時にドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-language-switcher]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    // ロケール設定をlocalStorageに保存
    localStorage.setItem('preferred-locale', newLocale);
    
    // サーバーサイド検出用にCookieにも保存
    document.cookie = `preferred-locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // 対象ロケールで新しいURLを生成
    const newUrl = getAlternateLocaleUrl(pathname, newLocale);
    
    // 新しいURLに遷移
    router.push(newUrl);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, locale: Locale) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLocaleChange(locale);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" data-language-switcher>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="flex items-center space-x-2 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        aria-label={`Current language: ${LOCALE_NAMES[currentLocale]}. Click to change language`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-lg" role="img" aria-hidden="true">
          {LOCALE_FLAGS[currentLocale]}
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentLocale.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-50"
          role="listbox"
          aria-label="Language options"
        >
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              onKeyDown={(e) => handleKeyDown(e, locale)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 ${
                locale === currentLocale
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300'
              } ${locale === locales[0] ? 'rounded-t-md' : ''} ${
                locale === locales[locales.length - 1] ? 'rounded-b-md' : ''
              }`}
              role="option"
              aria-selected={locale === currentLocale}
              tabIndex={0}
            >
              <span className="text-lg" role="img" aria-hidden="true">
                {LOCALE_FLAGS[locale]}
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">{LOCALE_NAMES[locale]}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {locale.toUpperCase()}
                </div>
              </div>
              {locale === currentLocale && (
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}