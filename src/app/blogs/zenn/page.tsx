import type { Metadata } from "next";

import SideNav from "@/components/SideNav";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import ZennArticleList from "@/components/ZennArticleList";

export const metadata: Metadata = {
  title: "Zennの記事一覧",
  description: "これまでZennで書いてきた記事の一覧です。",
  robots: "noindex"
};

const ZennPage = () => {
  return (
    <>
      <div className="w-full lg:w-[calc(100%_-_300px)] flex flex-col justify-between px-2 md:px-0">
        <div className="flex flex-col flex-grow gap-4">
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="flex justify-center items-center p-3 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-600">
              <BlogTypeTabs blogType="zenn" />
            </div>
          </div>
          <ZennArticleList />
        </div>
      </div>
      <SideNav />
    </>
  );
};

export default ZennPage;