import { Suspense } from "react";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ArticleList from "@/components/ArticleList";
import Skelton from "@/components/ArticleList/skelton";
import SearchStateCard from "@/components/SearchStateCard";
import SideNav from "@/components/SideNav";
import ZennArticleList from "@/components/ZennArticleList";
import { generateQuery } from "@/lib";
import {
  BLOG_TYPE_QUERY,
  CATEGORY_QUERY,
  KEYWORD_QUERY,
  PAGE_QUERY,
  CATEGORY_MAPED_ID,
} from "@/static/blogs";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import type { MappedKeyLiteralType } from "@/types/microcms";
import type { BlogTypeKeyLIteralType } from "@/types";

interface PageProps {
  params: {
    locale: string;
  };
  searchParams: {
    [BLOG_TYPE_QUERY]: BlogTypeKeyLIteralType;
    [PAGE_QUERY]: string;
    [CATEGORY_QUERY]: MappedKeyLiteralType;
    [KEYWORD_QUERY]: string;
  };
}

export async function generateMetadata({
  params: { locale },
  searchParams,
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "blog" });
  const tMeta = await getTranslations({ locale, namespace: "metadata" });
  const tCategories = await getTranslations({
    locale,
    namespace: "categories",
  });
  const blogType = searchParams.blogType || "blogs";
  const page = searchParams.page || null;
  const category = searchParams.category || null;
  const keyword = searchParams.keyword || null;

  // NOTE: ?blogType=zenn にアクセスした場合
  if (blogType === "zenn") {
    return {
      title: t("zennArticles"),
      description: t("zennArticles"),
    };
  }
  // NOTE: /blogs にアクセスした場合
  if (blogType === "blogs" && !category && !keyword) {
    return {
      title: page ? `${t("recentPosts")} - ${t("page")} ${page}` : "HOME",
      description: tMeta("siteDescription"),
      robots: page ? "noindex" : "index",
    };
  }

  let title = page ? ` - ${t("page")} ${page}` : "";
  let description = "";

  // カテゴリ名を翻訳
  let translatedCategory = category;
  if (category) {
    // カテゴリ名からIDを取得（CATEGORY_MAPED_NAMEから渡される場合を考慮）
    const categoryId =
      CATEGORY_MAPED_ID[category as keyof typeof CATEGORY_MAPED_ID] || category;
    try {
      // TypeScriptエラーを回避するために型アサーション
      translatedCategory = (tCategories as any)(categoryId);
    } catch {
      // 翻訳が見つからない場合は元の値を使用
      translatedCategory = category;
    }
  }

  // NOTE: ?category=hoge&keyword=fuga にアクセスした場合
  if (category && keyword) {
    title = `${translatedCategory} & ${keyword}` + title;
    description = `${translatedCategory} & ${keyword}`;
  }
  // NOTE: ?keyword=fuga にアクセスした場合
  if (keyword && !category) {
    title = `${keyword}` + title;
    description = `${keyword}`;
  }
  // NOTE: ?category=hoge にアクセスした場合
  if (category && !keyword) {
    title = `${translatedCategory}` + title;
    description = `${translatedCategory}`;
  }

  return {
    title: title,
    description: description,
    robots: page ? "noindex" : "index",
  };
}

const Page = ({ params: { locale }, searchParams }: PageProps) => {
  const category = searchParams[CATEGORY_QUERY];
  const keyword = searchParams[KEYWORD_QUERY];
  const blogType = searchParams[BLOG_TYPE_QUERY] || "blogs";
  const page = searchParams[PAGE_QUERY] || "1";

  const query: MicroCMSQueries = generateQuery(searchParams);

  return (
    <>
      <div className="flex w-full flex-col justify-between px-2 md:px-0 lg:w-[calc(100%_-_300px)]">
        <div className="flex flex-grow flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex items-center justify-center border-2 border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-black">
              <BlogTypeTabs blogType={blogType} locale={locale} />
            </div>
            {(category || keyword) && (
              <SearchStateCard category={category} keyword={keyword} locale={locale} />
            )}
          </div>
          {blogType === "zenn" ? (
            <ZennArticleList locale={locale} />
          ) : (
            <Suspense fallback={<Skelton />}>
              <ArticleList
                query={query}
                blogType={blogType}
                page={page}
                locale={locale}
              />
            </Suspense>
          )}
        </div>
      </div>
      <SideNav locale={locale} />
    </>
  );
};
export default Page;
