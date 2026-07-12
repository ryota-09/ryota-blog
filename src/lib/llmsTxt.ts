// llms.txt生成の共有ロジック。
// ロケール付きルート(/[locale]/docs/llms.txt)とロケール無しルート(/docs/llms.txt)で
// ほぼ同一の実装が二重管理されていたため、ここに集約する。
// 出力フォーマットは統合前の各ルートの挙動を維持する:
// - ロケール無し: 英語ヘッダー固定・URLはロケールプレフィックス無し(/blogs/...)
// - ロケール付き: 翻訳済みヘッダー・URLはロケールプレフィックス付き(/{locale}/blogs/...)
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

import { getAllBlogListByLocale } from "@/lib/content";
import { CATEGORIES, resolveCategoryOrDefault } from "@/static/categories";
import { baseURL } from "@/config";
import type { BlogPost, ContentLocale } from "@/types/content";
import type { CategoryEntry } from "@/static/categories";
import {
  AUTHOR_E_MAIL,
  SITE_DESCRIPTION_EN,
  SITE_DESCRIPTION,
  SITE_DOMAIN,
  SITE_TITLE,
} from "@/static/blogs";
import { getLocalizedCategoryName } from "@/lib/i18n-utils";

// LLMs.txt生成の設定
const LLMS_TXT_CONFIG = {
  cache: {
    maxAge: 3600, // 1時間キャッシュ
    staleWhileRevalidate: 86400, // 24時間は古いキャッシュを提供可能
  },
  retryAfter: 300, // エラー時の再試行推奨時間（5分）
  license: "Creative Commons Attribution 4.0 International License (CC BY 4.0)",
} as const;

type LlmsTxtData = {
  posts: BlogPost[];
  categories: CategoryEntry[];
};

/**
 * 公開可能な投稿をフィルタリング・ソートする
 */
function filterAndSortPosts(posts: BlogPost[]): BlogPost[] {
  return posts
    .filter(({ publishedAt, noIndex }) => publishedAt && !noIndex)
    .sort(({ publishedAt: aDate }, { publishedAt: bDate }) => {
      if (!aDate || !bDate) return 0;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
}

/**
 * ロケール無しルート用のサイトヘッダー(英語固定)
 */
function generateRootHeader(): string {
  return `# ${SITE_TITLE} (${SITE_DOMAIN})
> ${SITE_DESCRIPTION_EN}

# License
This content is made available under the ${LLMS_TXT_CONFIG.license}.
You are free to share and adapt this material for any purpose, including commercial use, as long as you provide appropriate attribution.

# Contact
For inquiries regarding content usage, corrections, or collaborations:
- Email: ${AUTHOR_E_MAIL}
- Website: ${baseURL}`;
}

/**
 * ロケール付きルート用のサイトヘッダー(翻訳・言語別ライセンス文)
 */
async function generateLocalizedHeader(locale: string): Promise<string> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const siteDescription = locale === "en" ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION;

  const licenseText =
    locale === "en"
      ? `This content is made available under the ${LLMS_TXT_CONFIG.license}.
You are free to share and adapt this material for any purpose, including commercial use, as long as you provide appropriate attribution.`
      : `このコンテンツは${LLMS_TXT_CONFIG.license}の下で提供されています。
適切な帰属表示を行う限り、商用利用を含むあらゆる目的でこの素材を自由に共有・改変できます。`;

  const contactText =
    locale === "en"
      ? "For inquiries regarding content usage, corrections, or collaborations:"
      : "コンテンツの利用、修正、コラボレーションに関するお問い合わせ:";

  return `# ${t("siteTitle")} (${SITE_DOMAIN})
> ${siteDescription}

# License
${licenseText}

# Contact
${contactText}
- Email: ${AUTHOR_E_MAIL}
- Website: ${baseURL}`;
}

/**
 * カテゴリ一覧部分を生成。localeがundefinedならcategories.jsonのnameをそのまま使う
 */
function generateCategoriesSection(
  categories: CategoryEntry[],
  locale?: string,
): string {
  const headerText = !locale || locale === "en" ? "## Categories" : "## カテゴリ";
  const noDataText =
    !locale || locale === "en"
      ? "No categories available."
      : "利用可能なカテゴリがありません。";

  if (categories.length === 0) {
    return `${headerText}\n\n${noDataText}`;
  }

  // カテゴリ名は content/categories.json 由来の name / name_en を正として使う
  const categoryList = categories
    .map((category) =>
      locale ? `- ${getLocalizedCategoryName(category, locale)}` : `- ${category.name}`,
    )
    .join("\n");

  return `${headerText}\n\n${categoryList}`;
}

/**
 * コンテンツ一覧部分を生成。localeがundefinedならロケールプレフィックス無しのURLを出力
 */
function generateContentSection(posts: BlogPost[], locale?: string): string {
  const headerText = !locale || locale === "en" ? "## Content" : "## コンテンツ";
  const noDataText =
    !locale || locale === "en"
      ? "No content available."
      : "利用可能なコンテンツがありません。";

  if (posts.length === 0) {
    return `${headerText}\n\n${noDataText}`;
  }

  const localePrefix = locale ? `/${locale}` : "";
  const contentList = posts
    .map((post) => {
      if (!post.publishedAt) return null;

      const categoryId = resolveCategoryOrDefault(post.categories[0]).slug;
      const url = `${baseURL}${localePrefix}/blogs/${categoryId}/${post.slug}`;
      const linkDetails = post.description ? `: ${post.description}` : "";
      return `- [${post.title}](${url})${linkDetails}`;
    })
    .filter(Boolean)
    .join("\n");

  return `${headerText}\n\n${contentList}`;
}

/**
 * ロケール無しルート(/docs/llms.txt)向けのllms.txt本文を構築
 */
export function buildRootLlmsTxt(): string {
  const data: LlmsTxtData = {
    posts: getAllBlogListByLocale("ja"),
    categories: CATEGORIES,
  };
  const filteredPosts = filterAndSortPosts(data.posts);

  const sections = [
    generateRootHeader(),
    generateCategoriesSection(data.categories),
    generateContentSection(filteredPosts),
  ];

  return sections.join("\n\n") + "\n";
}

/**
 * ロケール付きルート(/[locale]/docs/llms.txt)向けのllms.txt本文を構築
 */
export async function buildLocalizedLlmsTxt(locale: string): Promise<string> {
  const data: LlmsTxtData = {
    posts: getAllBlogListByLocale(locale as ContentLocale),
    categories: CATEGORIES,
  };
  const filteredPosts = filterAndSortPosts(data.posts);

  const sections = [
    await generateLocalizedHeader(locale),
    generateCategoriesSection(data.categories, locale),
    generateContentSection(filteredPosts, locale),
  ];

  return sections.join("\n\n") + "\n";
}

/**
 * 成功レスポンスを生成
 */
export function createLlmsTxtSuccessResponse(content: string): NextResponse {
  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": `public, max-age=${LLMS_TXT_CONFIG.cache.maxAge}, stale-while-revalidate=${LLMS_TXT_CONFIG.cache.staleWhileRevalidate}`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/**
 * エラーレスポンスを生成
 */
export function createLlmsTxtErrorResponse(error: unknown): NextResponse {
  console.error("Error generating llms.txt:", error);

  // エラーの種類に応じて適切なステータスコードを設定
  const isNetworkError =
    error instanceof Error &&
    (error.message.includes("fetch") || error.message.includes("network"));

  const status = isNetworkError ? 502 : 500;
  const message = isNetworkError ? "Bad Gateway" : "Internal Server Error";

  return new NextResponse(message, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Retry-After": LLMS_TXT_CONFIG.retryAfter.toString(),
      "X-Content-Type-Options": "nosniff",
    },
  });
}
