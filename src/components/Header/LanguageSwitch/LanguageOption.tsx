import type { SupportedLocale, LocaleInfo } from "@/types/locale";

interface LanguageOptionProps {
  localeInfo: LocaleInfo;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: (locale: SupportedLocale) => void;
  onKeyDown: (event: React.KeyboardEvent, locale: SupportedLocale) => void;
}

const LanguageOption = ({ 
  localeInfo, 
  isSelected, 
  isFirst, 
  isLast, 
  onSelect, 
  onKeyDown 
}: LanguageOptionProps) => {
  const baseClassName = "w-full px-3 py-2 text-left text-sm hover:bg-light dark:hover:bg-primary hover:text-white transition-colors";
  const roundedClassName = isFirst ? "rounded-t-md" : isLast ? "rounded-b-md" : "";
  const selectedClassName = isSelected 
    ? "bg-base-color dark:bg-secondary dark:text-gray-50" 
    : "text-gray-700 dark:text-gray-300";

  return (
    <button
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(localeInfo.code)}
      onKeyDown={(e) => onKeyDown(e, localeInfo.code)}
      className={`${baseClassName} ${roundedClassName} ${selectedClassName}`}
    >
      {localeInfo.nativeLabel}
      {isSelected && (
        <span className="ml-2 text-primary dark:text-gray-50" aria-hidden="true">
          ✓
        </span>
      )}
    </button>
  );
};

export default LanguageOption;