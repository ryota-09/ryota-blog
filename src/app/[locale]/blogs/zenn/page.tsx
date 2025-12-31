import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

import SideNav from "@/components/SideNav";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import ZennArticleList from "@/components/ZennArticleList";
import SearchStateCard from "@/components/SearchStateCard";

interface ZennPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    keyword?: string;
  }>;
}

export async function generateMetadata({ params }: ZennPageProps): Promise<Metadata> {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  
  return {
    title: t('zennArticles'),
    description: t('zennArticles'),
    robots: "noindex"
  };
}

const ZennPage = async ({ params, searchParams }: ZennPageProps) => {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const keyword = resolvedSearchParams.keyword;

  return (
    <>
      <div className="flex w-full flex-col justify-between px-2 md:px-0 lg:w-[calc(100%_-_300px)]">
        <div className="flex flex-grow flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex items-center justify-center border-2 border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-black">
              <BlogTypeTabs blogType="zenn" />
            </div>
            {keyword && <SearchStateCard keyword={keyword} blogType="zenn" />}
          </div>
          <ZennArticleList locale={locale} keyword={keyword} />
        </div>
      </div>
      <SideNav locale={locale} />
    </>
  );
};

export default ZennPage;