import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

import SideNav from "@/components/SideNav";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import ZennArticleList from "@/components/ZennArticleList";

interface ZennPageProps {
  params: Promise<{
    locale: string;
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

const ZennPage = async ({ params }: ZennPageProps) => {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale } = await params;
  return (
    <>
      <div className="w-full lg:w-[calc(100%_-_300px)] flex flex-col justify-between px-2 md:px-0">
        <div className="flex flex-col flex-grow gap-4">
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="flex justify-center items-center p-3 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-600">
              <BlogTypeTabs blogType="zenn" />
            </div>
          </div>
          <ZennArticleList locale={locale} />
        </div>
      </div>
      <SideNav locale={locale} />
    </>
  );
};

export default ZennPage;