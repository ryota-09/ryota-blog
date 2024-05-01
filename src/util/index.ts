import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cltw = (...inputs: (string | undefined)[]) => {
  return twMerge(clsx(inputs));
}