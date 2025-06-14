import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import type { SupportedLocale } from "@/types/locale";
import { generateLocalePath, saveLocaleToCookie, getSafeLocale } from "@/lib/locale";

export const useLanguageSwitch = () => {
  const locale = getSafeLocale(useLocale());
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 言語切り替え処理
  const switchLanguage = useCallback((targetLocale: SupportedLocale) => {
    if (targetLocale === locale) {
      setIsOpen(false);
      return;
    }

    try {
      const newPath = generateLocalePath(pathname, locale, targetLocale);
      saveLocaleToCookie(targetLocale);
      router.push(newPath);
      setIsOpen(false);
    } catch (error) {
      console.error("言語切り替えに失敗しました:", error);
    }
  }, [locale, pathname, router]);

  // ドロップダウンを開く/閉じる
  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // ドロップダウンを閉じる
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // キーボードイベントハンドラー
  const handleKeyDown = useCallback((event: React.KeyboardEvent, targetLocale?: SupportedLocale) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (targetLocale) {
          switchLanguage(targetLocale);
        } else {
          toggleDropdown();
        }
        break;
      case "Escape":
        closeDropdown();
        break;
    }
  }, [switchLanguage, toggleDropdown, closeDropdown]);

  // 外側クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, closeDropdown]);

  return {
    locale,
    isOpen,
    dropdownRef,
    switchLanguage,
    toggleDropdown,
    handleKeyDown
  };
};