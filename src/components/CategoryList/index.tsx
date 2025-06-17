import { getTranslations } from "next-intl/server";
import CategoryItem from "@/components/CategoryList/CategoryItem";
import { CATEGORY_MAPED_ID } from "@/static/blogs";

type CategoryListProps = {
  locale: string;
};

const CategoryList = async ({ locale }: CategoryListProps) => {
  const t = await getTranslations({ locale, namespace: "categories" });
  const tBlog = await getTranslations({ locale, namespace: "blog" });

  // カテゴリ配列を翻訳データで生成
  const categoryArray = Object.entries(CATEGORY_MAPED_ID).map(([_, id]) => ({
    id,
    name: t(id),
  }));

  return (
    <div className="relative" data-testid="pw-category-list">
      <div className="mb-8 px-0.5 text-xl dark:text-gray-400">
        {tBlog("categories")}
      </div>
      <nav className="md:max-h-[348px] md:overflow-y-scroll" role="navigation">
        <ul className="flex flex-wrap gap-4 divide-y-0 divide-gray-300 dark:divide-gray-600 md:flex-col md:gap-0 md:divide-y">
          {categoryArray.map(({ id, name }) => (
            <CategoryItem key={id} id={id} categoryName={name} />
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 left-0 hidden h-4 w-full backdrop-blur-[1px] md:block" />
    </div>
  );
};
export default CategoryList;
