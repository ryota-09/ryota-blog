"use client"
import Image from "next/image";
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


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label={t("languageSwitch")}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => handleKeyDown(e)}
        className="w-8 h-8 border dark:border-[#333] dark:bg-gray-400 rounded-md flex justify-center items-center transition opacity-50 hover:opacity-30"
      >
        <Image src="/icons/translate.svg" alt="language" width={20} height={20} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t("languageSwitch")}
          className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg min-w-[100px] z-50"
        >
          <button
            role="option"
            aria-selected={"ja" === locale}
            onClick={() => switchLanguage("ja")}
            onKeyDown={(e) => handleKeyDown(e, "ja")}
            className={`w-full px-3 py-2 text-left text-sm hover:bg-light dark:hover:bg-primary hover:text-white transition-colors rounded-t-md ${
              "ja" === locale 
                ? "bg-base-color dark:bg-secondary dark:text-gray-50" 
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            日本語
            {"ja" === locale && (
              <span className="ml-2 text-primary dark:text-gray-50">✓</span>
            )}
          </button>
          <button
            role="option"
            aria-selected={"en" === locale}
            onClick={() => switchLanguage("en")}
            onKeyDown={(e) => handleKeyDown(e, "en")}
            className={`w-full px-3 py-2 text-left text-sm hover:bg-light dark:hover:bg-primary hover:text-white transition-colors rounded-b-md ${
              "en" === locale 
                ? "bg-base-color dark:bg-secondary dark:text-gray-50" 
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            English
            {"en" === locale && (
              <span className="ml-2 text-primary dark:text-gray-50">✓</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitch;