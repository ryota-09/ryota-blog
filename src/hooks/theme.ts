"use client"
import { useState, useEffect } from "react";

export type Theme = "light" | "dark";

// localStorageはSafariプライベートモード(旧仕様)やストレージ無効化環境で
// SecurityErrorを投げるため、失敗してもテーマ機能全体が壊れないようにラップする
const readSavedTheme = (): Theme | null => {
  try {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || saved === "light" ? saved : null;
  } catch {
    return null;
  }
};

const saveTheme = (theme: Theme): void => {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // 保存できない環境ではセッション内のみテーマが維持される(実害なし)
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = readSavedTheme();
    if (saved) {
      // SSRとの不一致を避けるため、保存値の反映はマウント後に行う必要がある
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    // 副作用(DOM操作・保存)はsetStateのupdater外で行う(updaterは純粋関数であるべきため)
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    saveTheme(next);
    setTheme(next);
  };

  return { theme, toggleTheme };
};
