import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// 条件式（boolean）も受け取れるよう ClassValue で受ける
export const cltw = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
}

export const isWithinTwoWeeks = (date: string) => {
  const targetDate = new Date(date);
  const twoWeeksPrev = new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000);
  return targetDate >= twoWeeksPrev
}

export const calcDiffYears = (date: string) => {
  const targetDate = new Date(date);
  const now = new Date();
  return now.getFullYear() - targetDate.getFullYear();
}