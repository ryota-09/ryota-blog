// 記事詳細URL(/{locale}/blogs/{category}/{slug})のカテゴリが、そのlocaleの記事の
// プライマリカテゴリと異なる場合に正規URLを解決する純粋関数。
// middlewareから使うため、記事本文を含む content.ts(#content/index)には依存させないこと
// (バンドル肥大化防止。データは .velite/category-map.json の軽量マップを受け取る)。
//
// 背景: 記事のプライマリカテゴリはja/enで異なりうる(例: nextjs-typescript-book-review2 は
// ja=typescript / en=review)。言語切替はロケール接頭辞だけを置き換えるため、カテゴリが
// 異なる記事では他localeの存在しないURLに遷移して404になっていた(GSCの404にも計上)。

const ARTICLE_PATH_PATTERN = /^\/([^/]+)\/blogs\/([^/]+)\/([^/]+)$/;

type CategoryMap = Record<string, Record<string, string>>;

/**
 * リダイレクトすべき正規パスを返す。リダイレクト不要・対象外の場合は null。
 * - 既知カテゴリ配下の記事URLのみ対象(zenn/page等の他ルートを巻き込まない)
 * - そのlocaleに存在しないslugは対象外(従来どおり404)
 */
export const resolveArticleCanonicalPath = (
  pathname: string,
  categoryMap: CategoryMap,
  knownCategoryIds: ReadonlySet<string>,
): string | null => {
  const match = pathname.match(ARTICLE_PATH_PATTERN);
  if (!match) return null;

  const [, locale, categoryId, slug] = match;
  if (!knownCategoryIds.has(categoryId)) return null;

  const primaryCategoryId = categoryMap[locale]?.[slug];
  if (!primaryCategoryId || primaryCategoryId === categoryId) return null;
  // マップ側のカテゴリがマスタに無い(削除済み等)場合は正規URLを確定できないため対象外
  if (!knownCategoryIds.has(primaryCategoryId)) return null;

  return `/${locale}/blogs/${primaryCategoryId}/${slug}`;
};
