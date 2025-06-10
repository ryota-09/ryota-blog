import { NextResponse } from "next/server";
import { getAllBlogList, getAllCategoryList } from "@/lib/microcms";
import { baseURL } from "@/config";
import type { BlogsContentType, CategoriesContentType } from "@/types/microcms";
import {
  AUTHOR_E_MAIL,
  SITE_DESCRIPTION_EN,
  SITE_DOMAIN,
  SITE_TITLE,
} from "@/static/blogs";
import { getPrimaryCategoryId } from "@/lib";

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
function generateHeader(): string {
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
 * カテゴリ一覧部分を生成
 */
function generateCategoriesSection(
  categories: CategoriesContentType[],
): string {
  if (categories.length === 0) {
    return "## Categories\n\nNo categories available.";
  }

  const categoryList = categories.map(({ name }) => `- ${name}`).join("\n");

  return `## Categories\n\n${categoryList}`;
}

/**
 * コンテンツ一覧部分を生成
 */
function generateContentSection(posts: BlogsContentType[]): string {
  if (posts.length === 0) {
    return "## Content\n\nNo content available.";
  }

  const contentList = posts
    .map((post) => {
      if (!post.publishedAt) return null;
      
      const categoryId = getPrimaryCategoryId(post);
      const url = `${baseURL}/blogs/${categoryId}/${post.id}`;
      const linkDetails = post.description ? `: ${post.description}` : "";
      return `- [${post.title}](${url})${linkDetails}`;
    })
    .filter(Boolean)
    .join("\n");

  return `## Content\n\n${contentList}`;
}

/**
 * llms.txt フォーマットのコンテンツを構築
 */
function buildLlmsTxt({ posts, categories }: LlmsTxtData): string {
  const filteredPosts = filterAndSortPosts(posts);

  const sections = [
    generateHeader(),
    generateCategoriesSection(categories),
    generateContentSection(filteredPosts),
  ];

  return sections.join("\n\n") + "\n";
}

/**
 * microCMSからデータを取得
 */
async function fetchLlmsTxtData(): Promise<LlmsTxtData> {
  const [posts, categories] = await Promise.all([
    getAllBlogList({
      fields: "id,title,publishedAt,noIndex,description,category",
      orders: "-publishedAt",
    }),
    getAllCategoryList({
      fields: "id,name",
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
export async function GET(): Promise<NextResponse> {
  try {
    console.log("Starting llms.txt generation...");

    const data = await fetchLlmsTxtData();
    const content = buildLlmsTxt(data);

    console.log(
      `Generated llms.txt with ${data.posts.length} posts and ${data.categories.length} categories`,
    );

    return createSuccessResponse(content);
  } catch (error) {
    return createErrorResponse(error);
  }
}
