import { getRequestConfig } from 'next-intl/server';
import { isRoutingLocale, routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // 通常は `[locale]` セグメントの値に対応する
  let locale = await requestLocale;

  // 有効なロケールであることを保証する
  if (!isRoutingLocale(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default
  };
});