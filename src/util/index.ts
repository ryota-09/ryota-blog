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
  // NOTE: 暦年の差分ではなく実経過時間で算出する（年末公開→年始閲覧で即「古い記事」と誤判定するのを防ぐ）
  const diffMs = new Date().getTime() - new Date(date).getTime();
  return Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
}

// Veliteがビルド時に生成したblurDataURLをnext/imageのプレースホルダーに変換する。
// blurプレースホルダーはハイドレーション不要でペイント直後から表示されるため、
// 遷移時にグレーのスケルトンが明滅するちらつきが発生しない。
// blurDataURLはVeliteのスキーマ上必須だが、万一空だった場合にplaceholder="blur"のまま
// blurDataURL無しでnext/imageに渡すとエラーになるため"empty"へフォールバックする
export const thumbnailPlaceholderProps = (blurDataURL: string | undefined) => {
  return blurDataURL
    ? { placeholder: "blur" as const, blurDataURL }
    : { placeholder: "empty" as const };
}