import { NextResponse } from "next/server";
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
import { getTranslations } from 'next-intl/server';

// 日付フォーマットの国際化 API
const DATE_FMT = new Intl.DateTimeFormat("en-CA", {
  dateStyle: "short",
  timeZone: "UTC",
});
const toYYYYMMDD = (iso: string) => DATE_FMT.format(new Date(iso));

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
}

// Next.js 16では、Route Handlerのparamsは非同期になった
type RouteContext = {
  params: Promise<{
    locale: string;
  }>;
}

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
 * 投稿の日付を YYYY-MM-DD 形式でフォーマット
 */
function formatPublishDate(publishedAt: string): string {
  try {
    return toYYYYMMDD(publishedAt);
  } catch (error) {
    console.warn(`Invalid date format: ${publishedAt}`, error);
    return "未定";
  }
}

/**
 * サイトヘッダー部分を生成
 */
async function generateHeader(locale: string): Promise<string> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const siteDescription = locale === 'en' ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION;
  
  const licenseText = locale === 'en' 
    ? `This content is made available under the ${LLMS_TXT_CONFIG.license}.
You are free to share and adapt this material for any purpose, including commercial use, as long as you provide appropriate attribution.`
    : `このコンテンツは${LLMS_TXT_CONFIG.license}の下で提供されています。
適切な帰属表示を行う限り、商用利用を含むあらゆる目的でこの素材を自由に共有・改変できます。`;

  const contactText = locale === 'en'
    ? 'For inquiries regarding content usage, corrections, or collaborations:'
    : 'コンテンツの利用、修正、コラボレーションに関するお問い合わせ:';

  return `# ${t('siteTitle')} (${SITE_DOMAIN})
> ${siteDescription}

# License
${licenseText}

# Contact
${contactText}
- Email: ${AUTHOR_E_MAIL}
- Website: ${baseURL}`;
}

/**
 * カテゴリ一覧部分を生成
 */
async function generateCategoriesSection(
  categories: CategoryEntry[],
  locale: string
): Promise<string> {
  const headerText = locale === 'en' ? '## Categories' : '## カテゴリ';
  const noDataText = locale === 'en' ? 'No categories available.' : '利用可能なカテゴリがありません。';
  
  if (categories.length === 0) {
    return `${headerText}\n\n${noDataText}`;
  }

  // カテゴリ名は content/categories.json 由来の name / name_en を正として使う
  const categoryList = categories
    .map((category) => `- ${getLocalizedCategoryName(category, locale)}`)
    .join("\n");

  return `${headerText}\n\n${categoryList}`;
}

/**
 * コンテンツ一覧部分を生成
 */
function generateContentSection(posts: BlogPost[], locale: string): string {
  const headerText = locale === 'en' ? '## Content' : '## コンテンツ';
  const noDataText = locale === 'en' ? 'No content available.' : '利用可能なコンテンツがありません。';

  if (posts.length === 0) {
    return `${headerText}\n\n${noDataText}`;
  }

  const contentList = posts
    .map((post) => {
      if (!post.publishedAt) return null;

      const categoryId = resolveCategoryOrDefault(post.categories[0]).slug;
      const url = `${baseURL}/${locale}/blogs/${categoryId}/${post.slug}`;
      const linkDetails = post.description ? `: ${post.description}` : "";
      return `- [${post.title}](${url})${linkDetails}`;
    })
    .filter(Boolean)
    .join("\n");

  return `${headerText}\n\n${contentList}`;
}

/**
 * llms.txt フォーマットのコンテンツを構築
 */
async function buildLlmsTxt({ posts, categories }: LlmsTxtData, locale: string): Promise<string> {
  const filteredPosts = filterAndSortPosts(posts);

  const sections = [
    await generateHeader(locale),
    await generateCategoriesSection(categories, locale),
    generateContentSection(filteredPosts, locale),
  ];

  return sections.join("\n\n") + "\n";
}

/**
 * ファイルベースのコンテンツ層からデータを取得
 */
function fetchLlmsTxtData(locale: string): LlmsTxtData {
  const posts = getAllBlogListByLocale(locale as ContentLocale);
  const categories = CATEGORIES;

  return { posts, categories };
}

/**
 * 成功レスポンスを生成
 */
function createSuccessResponse(content: string): NextResponse {
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
function createErrorResponse(error: unknown): NextResponse {
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

/**
 * llms.txt APIエンドポイント
 */
export async function GET(request: Request, { params }: RouteContext): Promise<NextResponse> {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale } = await params;
  
  try {
    console.log(`Starting llms.txt generation for locale: ${locale}...`);

    const data = fetchLlmsTxtData(locale);
    const content = await buildLlmsTxt(data, locale);

    console.log(
      `Generated llms.txt with ${data.posts.length} posts and ${data.categories.length} categories`,
    );

    return createSuccessResponse(content);
  } catch (error) {
    return createErrorResponse(error);
  }
}