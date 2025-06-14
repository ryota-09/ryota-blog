export const SUPPORTED_LOCALES = ["ja", "en"] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export interface LocaleInfo {
  code: SupportedLocale;
  label: string;
  nativeLabel: string;
}

export const LOCALE_INFO: Record<SupportedLocale, LocaleInfo> = {
  ja: {
    code: "ja",
    label: "Japanese", 
    nativeLabel: "日本語"
  },
  en: {
    code: "en", 
    label: "English",
    nativeLabel: "English"
  }
} as const;

export const DEFAULT_LOCALE: SupportedLocale = "ja";

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 31536000; // 1年