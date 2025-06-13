"use client"
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const LOCALES = ["ja", "en"] as const;
type Locale = typeof LOCALES[number];

const LanguageSwitch = () => {
  const locale = useLocale() as Locale;
  const t = useTranslations("navigation");
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 現在のパスから新しいロケールのパスを生成
  const generateNewPath = (newLocale: Locale) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "");
    return `/${newLocale}${pathWithoutLocale}`;
  };

  // 言語を切り替える
  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === locale) return;
    
    const newPath = generateNewPath(newLocale);
    // 選択したロケールをCookieに保存
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.push(newPath);
    setIsOpen(false);
  };

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // キーボードナビゲーション
  const handleKeyDown = (event: React.KeyboardEvent, newLocale?: Locale) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (newLocale) {
        switchLanguage(newLocale);
      } else {
        setIsOpen(!isOpen);
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const getCurrentLanguageLabel = () => {
    return locale === "ja" ? "日本語" : "English";
  };

  const getLanguageLabel = (targetLocale: Locale) => {
    return targetLocale === "ja" ? t("switchToJapanese") : t("switchToEnglish");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label={t("languageSwitch")}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => handleKeyDown(e)}
        className="w-8 h-8 border dark:border-[#333] dark:bg-gray-400 rounded-md flex justify-center items-center transition opacity-50 hover:opacity-30 text-xs font-medium"
      >
        {locale.toUpperCase()}
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t("languageSwitch")}
          className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg min-w-[120px] z-50"
        >
          {LOCALES.map((targetLocale) => (
            <button
              key={targetLocale}
              role="option"
              aria-selected={targetLocale === locale}
              onClick={() => switchLanguage(targetLocale)}
              onKeyDown={(e) => handleKeyDown(e, targetLocale)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                targetLocale === locale 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300"
              } ${targetLocale === LOCALES[0] ? "rounded-t-md" : ""} ${
                targetLocale === LOCALES[LOCALES.length - 1] ? "rounded-b-md" : ""
              }`}
            >
              {getLanguageLabel(targetLocale)}
              {targetLocale === locale && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitch;