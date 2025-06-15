import { NextResponse } from "next/server";
import { getAllBlogListByLocale, getAllCategoryList } from "@/lib/microcms";
import { baseURL } from "@/config";
import type { BlogsContentType, CategoriesContentType } from "@/types/microcms";
import {
  AUTHOR_E_MAIL,
  SITE_DESCRIPTION_EN,
  SITE_DESCRIPTION,
  SITE_DOMAIN,
  SITE_TITLE,
} from "@/static/blogs";
import { getPrimaryCategoryId } from "@/lib";
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

interface LlmsTxtData {
  posts: BlogsContentType[];
  categories: CategoriesContentType[];
}

interface RouteContext {
  params: {
    locale: string;
  };
}

/**
 * 公開可能な投稿をフィルタリング・ソートする
 */
function filterAndSortPosts(posts: BlogsContentType[]): BlogsContentType[] {
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
  categories: CategoriesContentType[],
  locale: string
): Promise<string> {
  const headerText = locale === 'en' ? '## Categories' : '## カテゴリ';
  const noDataText = locale === 'en' ? 'No categories available.' : '利用可能なカテゴリがありません。';
  
  if (categories.length === 0) {
    return `${headerText}\n\n${noDataText}`;
  }

  // 翻訳を取得
  const tCategories = await getTranslations({ locale, namespace: 'categories' });

  // カテゴリ名を取得（英語の場合は翻訳システムを使用）
  const categoryList = categories.map(({ id, name, name_en }) => {
    let displayName: string;
    if (locale === 'en') {
      // 英語の場合は翻訳システムを使用、フォールバックでname_enまたはname
      try {
        displayName = tCategories(id);
      } catch {
        displayName = name_en || name;
      }
    } else {
      displayName = name;
    }
    return `- ${displayName}`;
  }).join("\n");

  return `${headerText}\n\n${categoryList}`;
}

/**
 * コンテンツ一覧部分を生成
 */
function generateContentSection(posts: BlogsContentType[], locale: string): string {
  const headerText = locale === 'en' ? '## Content' : '## コンテンツ';
  const noDataText = locale === 'en' ? 'No content available.' : '利用可能なコンテンツがありません。';
  
  if (posts.length === 0) {
    return `${headerText}\n\n${noDataText}`;
  }

  const contentList = posts
    .map((post) => {
      if (!post.publishedAt) return null;
      
      const categoryId = getPrimaryCategoryId(post);
      const url = `${baseURL}/${locale}/blogs/${categoryId}/${post.id}`;
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
 * microCMSからデータを取得
 */
async function fetchLlmsTxtData(locale: string): Promise<LlmsTxtData> {
  const [posts, categories] = await Promise.all([
    getAllBlogListByLocale(locale, {
      fields: "id,title,publishedAt,noIndex,description,category",
      orders: "-publishedAt",
    }),
    getAllCategoryList({
      fields: "id,name,name_en",
      orders: "createdAt",
    }),
  ]);

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
  const { locale } = params;
  
  try {
    console.log(`Starting llms.txt generation for locale: ${locale}...`);

    const data = await fetchLlmsTxtData(locale);
    const content = await buildLlmsTxt(data, locale);

    console.log(
      `Generated llms.txt with ${data.posts.length} posts and ${data.categories.length} categories`,
    );

    return createSuccessResponse(content);
  } catch (error) {
    return createErrorResponse(error);
  }
}