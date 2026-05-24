/**
 * i18n関連のユーティリティ関数
 */

import type { CategoriesContentType } from "@/types/microcms";

/**
 * 現在のパスから別のlocaleのパスを生成
 */
export function getAlternateLocaleUrl(currentPath: string, targetLocale: string): string {
  // localeパターンにマッチするかチェック
  const localePattern = /^\/([a-z]{2})(\/|$)/;
  const match = currentPath.match(localePattern);
  
  if (match) {
    // 既存のlocaleを新しいlocaleに置き換え
    return currentPath.replace(localePattern, `/${targetLocale}$2`);
  }
  
  // localeが含まれていない場合は先頭に追加
  return `/${targetLocale}${currentPath}`;
}

/**
 * localeを含むパスを生成
 */
export function getLocalizedPath(path: string, locale: string): string {
  // 既にlocaleが含まれている場合はそのまま返す
  if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
    return path;
  }
  
  // 外部リンクの場合はそのまま返す
  if (path.startsWith('http') || path.startsWith('//')) {
    return path;
  }
  
  // アンカーリンクの場合はそのまま返す
  if (path.startsWith('#')) {
    return path;
  }
  
  // その他の内部リンクにはlocaleを追加
  return path.startsWith('/') ? `/${locale}${path}` : `/${locale}/${path}`;
}

/**
 * ブログ記事のパスを生成
 */
export function getBlogPath(locale: string, categoryId: string, blogId: string): string {
  return `/${locale}/blogs/${categoryId}/${blogId}`;
}

/**
 * カテゴリページのパスを生成
 */
export function getCategoryPath(locale: string, categoryId: string): string {
  return `/${locale}/blogs/${categoryId}`;
}

/**
 * ブログ一覧ページのパスを生成
 */
export function getBlogsPath(locale: string, page?: number): string {
  if (page && page > 1) {
    return `/${locale}/blogs/page/${page}`;
  }
  return `/${locale}/blogs`;
}

/**
 * カテゴリページのページネーションパスを生成
 */
export function getCategoryPaginationPath(locale: string, categoryId: string, page: number): string {
  if (page === 1) {
    return getCategoryPath(locale, categoryId);
  }
  return `/${locale}/blogs/${categoryId}/page/${page}`;
}

/**
 * ロケールに応じたカテゴリ名を取得
 */
export function getLocalizedCategoryName(category: CategoriesContentType, locale: string): string {
  // 英語ロケールでname_enが存在する場合はそれを使用
  if (locale === 'en' && category.name_en) {
    return category.name_en;
  }
  // それ以外は日本語名を使用
  return category.name;
}

/**
 * 多言語データから現在のロケールに合致する値を取り出す
 */
export const pickLocalized = <T,>(value: { ja: T; en: T }, locale: string): T =>
  locale === "en" ? value.en : value.ja;

/**
 * "YYYY-MM" を年月の表示用に整形する
 */
const formatYearMonth = (yyyyMm: string, locale: string): string => {
  const [yearStr, monthStr] = yyyyMm.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (locale === "en") {
    const monthsEn = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return `${monthsEn[month - 1]} ${year}`;
  }
  return `${year}年${month}月`;
};

/**
 * キャリアタイムラインの期間表示文字列
 */
export const formatPeriod = (
  period: { start: string; end: string | null },
  locale: string,
): string => {
  const start = formatYearMonth(period.start, locale);
  if (period.end === null) {
    return locale === "en" ? `${start} — Present` : `${start} 〜 現在`;
  }
  const end = formatYearMonth(period.end, locale);
  return locale === "en" ? `${start} — ${end}` : `${start} 〜 ${end}`;
};

/**
 * OutputEntry の種別ラベル（執筆/登壇/選抜/主催）
 */
export const outputKindLabel = (
  kind: "writing" | "speaking" | "selection" | "organize",
  locale: string,
): string => {
  const labelMap = {
    writing: { ja: "執筆", en: "Writing" },
    speaking: { ja: "登壇", en: "Speaking" },
    selection: { ja: "選抜", en: "Selection" },
    organize: { ja: "主催", en: "Organize" },
  };
  return pickLocalized(labelMap[kind], locale);
};