import { MetadataRoute } from "next";

import { baseURL } from "@/config";
import { getAllBlogListByLocale, getBlogList, getCategoriesWithArticles } from "@/lib/content";
import { resolveCategoryOrDefault } from "@/static/categories";
import { SUPPORTED_LOCALES } from "@/types/locale";
import type { BlogPost, ContentLocale } from "@/types/content";

type SitemapEntry = MetadataRoute.Sitemap[number];

// 記事の最終更新日(updatedAt優先、無ければpublishedAt)
const articleLastModified = (content: Pick<BlogPost, "updatedAt" | "publishedAt">): string =>
  content.updatedAt || content.publishedAt;

// 一覧ページの最終更新日 = 掲載記事のうち最も新しい最終更新日。
// NOTE: 以前はビルド時刻(new Date())を入れていたため、デプロイのたびに一覧系URLのlastmodが一斉に
//       変わっていた。Googleはlastmodが「一貫して正確」な場合しか使わないため、実態と無関係な値は
//       サイトマップ全体のlastmodの信頼性を下げる。記事が無い場合はlastmod自体を出さない
const latestLastModified = (
  contents: ReadonlyArray<Pick<BlogPost, "updatedAt" | "publishedAt">>,
): string | undefined =>
  contents
    .map(articleLastModified)
    .filter(Boolean)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

// lastModifiedが無いエントリはキー自体を出さない
const withLastModified = (url: string, lastModified: string | undefined): SitemapEntry =>
  lastModified ? { url, lastModified } : { url };

// NOTE: ページネーション(/blogs/page/N・/blogs/{category}/page/N)はnoindexなので載せない。
//       サイトマップは「インデックスしてほしいURLの一覧」なので、noindexのURLを混ぜると
//       矛盾したシグナルになる(2026-11 GSCで送信済みURLのうち23件がnoindex除外になっていた)。
//       ページネーション自体は一覧ページからのリンクで引き続きクロールされる
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // トップ(/blogs)・アバウトの多言語対応
    // トップのlastmodはトップに表示される記事(hideFromHome除外後)の最新更新日
    const staticPaths = SUPPORTED_LOCALES.flatMap((locale): SitemapEntry[] => {
      const homeContents = getBlogList(locale as ContentLocale, {
        limit: Number.MAX_SAFE_INTEGER,
        excludeHiddenFromHome: true,
      }).contents;
      return [
        withLastModified(`${baseURL}/${locale}/blogs`, latestLastModified(homeContents)),
        // アバウトは更新日の情報源が無いため、不正確な値を出さずlastmodを省略する
        { url: `${baseURL}/${locale}/about` },
      ];
    });

    // カテゴリページのパスの多言語対応
    // NOTE: 記事0件のカテゴリページは404になる(ソフト404回避)ため、記事のあるカテゴリのみ載せる
    const categoryPaths = SUPPORTED_LOCALES.flatMap((locale) =>
      getCategoriesWithArticles(locale as ContentLocale).map((category) => {
        const categoryContents = getBlogList(locale as ContentLocale, {
          category: category.id,
          limit: Number.MAX_SAFE_INTEGER,
        }).contents;
        return withLastModified(
          `${baseURL}/${locale}/blogs/${category.slug}`,
          latestLastModified(categoryContents),
        );
      }),
    );

    // ブログ記事の動的パスの多言語対応
    // NOTE: ロケールごとにファイルベースの記事一覧を取得する（ja/enで記事のプライマリカテゴリが
    //       異なるケースが存在するため、ロケール非依存の使い回しはせずロケールごとに正しく計算する）
    let dynamicPaths: SitemapEntry[] = [];
    try {
      dynamicPaths = SUPPORTED_LOCALES.flatMap((locale) => {
        const blogList = getAllBlogListByLocale(locale as ContentLocale).filter(
          (content) => !content.noIndex,
        );
        return blogList.map((content) => {
          const categoryId = resolveCategoryOrDefault(content.categories[0]).slug;
          return withLastModified(
            `${baseURL}/${locale}/blogs/${categoryId}/${content.slug}`,
            // NOTE: 最終更新日は updatedAt を優先する（無ければ publishedAt）
            articleLastModified(content),
          );
        });
      });
    } catch (error) {
      console.warn('ブログ記事のサイトマップ生成に失敗しました:', error);
    }

    return [...staticPaths, ...categoryPaths, ...dynamicPaths];
  } catch (error) {
    console.error('サイトマップ生成中にエラーが発生しました:', error);
    // 最低限の静的パスのみ返す
    return SUPPORTED_LOCALES.flatMap((locale) => [
      { url: `${baseURL}/${locale}/blogs` },
      { url: `${baseURL}/${locale}/about` },
    ]);
  }
}
