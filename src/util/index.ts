import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cltw = (...inputs: (string | undefined)[]) => {
  return twMerge(clsx(inputs));
};

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

export const isWithinTwoWeeks = (date: string) => {
  const targetDate = new Date(date);
  const now = new Date();
  const twoWeeksPrev = new Date(now.getTime() - TWO_WEEKS_MS);
  return targetDate >= twoWeeksPrev && targetDate <= now;
};

export const calcDiffYears = (date: string) => {
  const targetDate = new Date(date);
  const now = new Date();
  return now.getFullYear() - targetDate.getFullYear();
};
