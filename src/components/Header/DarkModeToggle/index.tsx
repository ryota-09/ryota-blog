"use client"
import Image from "next/image";
import { useTheme } from "@/hooks/theme";

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      aria-label="ダークモード切替"
      onClick={toggleTheme}
      className="w-8 h-8 border dark:border-[#333] dark:bg-gray-400 rounded-md flex justify-center items-center transition opacity-50 hover:opacity-30"
    >
      <Image src={theme === "dark" ? "/icons/moon.svg" : "/icons/sun.svg"} alt="theme" width={20} height={20} />
    </button>
  );
};

export default DarkModeToggle;
