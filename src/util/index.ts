import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cltw = (...inputs: (string | undefined)[]) => {
  return twMerge(clsx(inputs));
};

export const isWithinTwoWeeks = (date: string) => {
  const targetDate = new Date(date);
  const twoWeeksPrev = new Date(
    new Date().getTime() - 14 * 24 * 60 * 60 * 1000,
  );
  const now = new Date();
  return targetDate >= twoWeeksPrev && targetDate <= now;
};

export const calcDiffYears = (date: string) => {
  const targetDate = new Date(date);
  const now = new Date();
  return now.getFullYear() - targetDate.getFullYear();
};
