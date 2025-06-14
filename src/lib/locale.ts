import type { SupportedLocale } from "@/types/locale";
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_MAX_AGE, SUPPORTED_LOCALES } from "@/types/locale";

/**
 * 現在のパスから新しいロケールのパスを生成
 */
export const generateLocalePath = (pathname: string, currentLocale: SupportedLocale, targetLocale: SupportedLocale): string => {
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "");
  return `/${targetLocale}${pathWithoutLocale}`;
};

/**
 * ロケールをCookieに保存
 */
export const saveLocaleToCookie = (locale: SupportedLocale): void => {
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
};

/**
 * 渡された値が有効なロケールかチェック
 */
export const isValidLocale = (locale: string): locale is SupportedLocale => {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
};

/**
 * 安全にロケールを取得（フォールバック付き）
 */
export const getSafeLocale = (locale: string, fallback: SupportedLocale = "ja"): SupportedLocale => {
  return isValidLocale(locale) ? locale : fallback;
};