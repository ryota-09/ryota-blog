"use client"
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLanguageSwitch } from "@/hooks/useLanguageSwitch";
import { LOCALE_INFO, SUPPORTED_LOCALES } from "@/types/locale";
import LanguageOption from "./LanguageOption";

const LanguageSwitch = () => {
  const t = useTranslations("navigation");
  const { locale, isOpen, dropdownRef, switchLanguage, toggleDropdown, handleKeyDown } = useLanguageSwitch();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label={t("languageSwitch")}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className="w-8 h-8 border dark:border-[#333] dark:bg-gray-400 rounded-md flex justify-center items-center transition opacity-50 hover:opacity-30"
      >
        <Image 
          src="/icons/translate.svg" 
          alt="" 
          width={20} 
          height={20}
          priority={false}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t("languageSwitch")}
          className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg min-w-[100px] z-50"
        >
          {SUPPORTED_LOCALES.map((localeCode, index) => (
            <LanguageOption
              key={localeCode}
              localeInfo={LOCALE_INFO[localeCode]}
              isSelected={localeCode === locale}
              isFirst={index === 0}
              isLast={index === SUPPORTED_LOCALES.length - 1}
              onSelect={switchLanguage}
              onKeyDown={handleKeyDown}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitch;