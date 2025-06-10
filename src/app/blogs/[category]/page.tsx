import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleCard from "@/components/ArticleList/ArticleCard";
import BreadcrumbList from "@/components/BreadcrumbList";
import { getBlogList, getAllCategoryList } from "@/lib/microcms";
import { CATEGORY_MAPED_NAME, CATEGORY_MAPED_ID } from "@/static/blogs";
import type { BlogsContentType } from "@/types/microcms";

export async function generateStaticParams() {
  return Object.values(CATEGORY_MAPED_ID).map((categoryId) => ({
    category: categoryId
  }));
}

export async function generateMetadata(
  { params }: { params: { category: string } }
): Promise<Metadata> {
  const categoryName = CATEGORY_MAPED_NAME[params.category];
  
  if (!categoryName) {
    notFound();
  }

  return {
    title: `${categoryName}の記事一覧`,
    description: `${categoryName}に関する技術記事の一覧です。`,
  };
}

type PageProps = {
  params: {
    category: string;
  };
};

const Page = async ({ params }: PageProps) => {
  const categoryName = CATEGORY_MAPED_NAME[params.category];
  
  if (!categoryName) {
    notFound();
  }
  
  const blogData = await getBlogList({
    filters: `category[contains]${categoryName}`,
  });

  const breadcrumbAssets = [
    { label: "Home", href: "/" },
    { label: "Blogs", href: "/blogs" },
    { label: categoryName, href: `/blogs/${params.category}` },
  ];

  return (
    <div className="max-w-[1028px] mx-auto px-2 md:px-0">
      <BreadcrumbList items={breadcrumbAssets} />
      <div className="bg-white dark:bg-black border-2 dark:border-gray-600 px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {categoryName}の記事一覧
        </h1>
        <div className="grid gap-6 mb-8">
          {blogData.contents.map((blog, index) => (
            <ArticleCard key={blog.id} data={blog} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;