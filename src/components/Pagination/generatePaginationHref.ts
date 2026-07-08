// ページネーションリンクのhref生成ロジック(PaginationItem / EllipsisMenuItemで共用)。
// 以前は両コンポーネントにほぼ同一のロジックが複製されており、encodeURIComponentの有無など
// 実装差分が生まれていたため1箇所に集約した(Issue #225のレビュー対応)。
type GeneratePaginationHrefArgs = {
  /** usePathname()の戻り値 */
  pathname: string | null;
  /** useSearchParams()の戻り値(検索ページでkeyword/categoryを保持するために使う) */
  searchParams: { get(name: string): string | null } | null;
  /** リンク先のページ番号 */
  pageNumber?: number;
  /** サーバーサイドから明示されたベースパス(通常の一覧・カテゴリページで使用) */
  basePath?: string;
};

export const generatePaginationHref = ({
  pathname,
  searchParams,
  pageNumber,
  basePath,
}: GeneratePaginationHrefArgs): string => {
  // 国際化対応: /{locale}/blogs/{segment} 形式かどうかを確認
  const categoryPathMatch = pathname?.match(/^\/([^\/]+)\/blogs\/([^\/]+)$/);
  const locale = categoryPathMatch
    ? categoryPathMatch[1]
    : pathname?.match(/^\/([^\/]+)/)?.[1] || "ja";
  const categoryId = categoryPathMatch ? categoryPathMatch[2] : null;

  // 検索結果ページ(/blogs/search)ではkeyword/categoryクエリを保持したままpageクエリで遷移する。
  // NOTE: basePath分岐より先に評価すること。将来検索ページの呼び出しにbasePathが
  // 渡されても検索条件の保持が壊れないようにするため
  if (categoryId === "search") {
    const params = new URLSearchParams();
    const keywordParam = searchParams?.get("keyword");
    const categoryParam = searchParams?.get("category");
    if (keywordParam) params.set("keyword", keywordParam);
    if (categoryParam) params.set("category", categoryParam);
    if (pageNumber !== undefined && pageNumber !== 1) params.set("page", String(pageNumber));
    const queryString = params.toString();
    return `/${locale}/blogs/search${queryString ? `?${queryString}` : ""}`;
  }

  // サーバーサイドでbasePathが提供されている場合はそれを使用
  if (basePath) {
    if (pageNumber === 1) {
      return basePath;
    }
    return `${basePath}/page/${pageNumber}`;
  }

  // NOTE: 一覧・カテゴリページはsearchParamsを読まない静的ページになり、keywordクエリ付きで
  // これらのpathnameに滞在する経路は消滅したため、旧来のkeywordクエリ保持分岐は廃止した
  const baseHref = categoryId ? `/${locale}/blogs/${categoryId}` : `/${locale}/blogs`;

  if (pageNumber === 1) {
    return baseHref;
  }

  // パスベースのページネーション形式を使用
  return `${baseHref}/page/${pageNumber}`;
};
