// カテゴリマスタ。データソースはVelite(content/categories.json →.velite/categories.json)。
// 旧 categories.generated.ts (microCMS由来・generate-categories.jsが生成)を置き換える。
//
// content/categories.jsonの`id`は、旧microCMSのcontent idにURLスラッグオーバーライド
// (例: "ui-parts" → "ui_parts")を適用済みの値が入っている。そのため本ファイルでは
// CategoryEntry.id と CategoryEntry.slug は常に同じ値になる(現行の型形状を維持するため両方保持する)。
import { categories as CATEGORY_RECORDS } from "#content/index";

export type CategoryEntry = {
  id: string;
  slug: string;
  name: string;
  name_en: string;
  // 現行UIでは未使用。将来利用する場合に備えJSONの情報を落とさず保持する
  icon?: string;
  bg_color?: string;
};

export const CATEGORIES: CategoryEntry[] = CATEGORY_RECORDS.map((category) => ({
  id: category.id,
  slug: category.id,
  name: category.name,
  name_en: category.name_en,
  icon: category.icon,
  bg_color: category.bg_color,
}));

// 記事にカテゴリが1件も紐付かない場合のみ使う最終フォールバック
export const DEFAULT_CATEGORY_ID = "programming";

export const findCategoryBySlug = (slug: string): CategoryEntry | undefined =>
  CATEGORIES.find((category) => category.slug === slug);

export const findCategoryByContentId = (id: string): CategoryEntry | undefined =>
  CATEGORIES.find((category) => category.id === id);

// URLスラッグ・content id・表示名(ja/en)のいずれでもカテゴリを解決する（?category=クエリの後方互換のため）
export const resolveCategoryEntry = (value: string): CategoryEntry | undefined =>
  CATEGORIES.find(
    (category) =>
      category.slug === value ||
      category.id === value ||
      category.name === value ||
      category.name_en === value,
  );

// "programming"がCATEGORIES自体に存在しない極端なケースのみ使う最終手段のフォールバック
const HARD_FALLBACK_ENTRY: CategoryEntry = {
  id: DEFAULT_CATEGORY_ID,
  slug: DEFAULT_CATEGORY_ID,
  name: "プログラミング",
  name_en: "Programming",
};

// content idからカテゴリを解決する唯一の入り口。見つからない場合（記事に紐づくカテゴリが
// 削除された等）は必ずDEFAULT_CATEGORY_IDのエントリにフォールバックし、
// 呼び出し箇所ごとに異なる場当たり的なフォールバック（生idの通過・未翻訳文字列の表示等）を防ぐ。
export const resolveCategoryOrDefault = (contentId: string | undefined): CategoryEntry => {
  if (contentId) {
    const entry = findCategoryByContentId(contentId);
    if (entry) return entry;
  }
  return findCategoryBySlug(DEFAULT_CATEGORY_ID) ?? HARD_FALLBACK_ENTRY;
};
