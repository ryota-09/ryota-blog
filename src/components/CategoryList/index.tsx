import { getTranslations } from 'next-intl/server';
import CategoryItem from "@/components/CategoryList/CategoryItem";
import { getLocalizedCategoryName } from "@/lib/i18n-utils";
import { CATEGORIES } from "@/static/categories";

type CategoryListProps = {
  locale: string;
}

const CategoryList = async ({ locale }: CategoryListProps) => {
  const tBlog = await getTranslations({ locale, namespace: 'blog' });

  // カテゴリ配列をmicroCMSのcategoriesコンテンツから生成
  const categoryArray = CATEGORIES.map((category) => ({
    id: category.slug,
    name: getLocalizedCategoryName(category, locale)
  }));

  return (
    <div className="relative" data-testid="pw-category-list">
      <div className="text-xl mb-8 px-0.5 dark:text-gray-400">{tBlog('categories')}</div>
      <nav className="md:overflow-y-scroll md:max-h-[348px]">
        <ul className="divide-y-0 md:divide-y divide-gray-300 dark:divide-gray-600 flex flex-wrap gap-4 md:gap-0 md:flex-col">
          {categoryArray.map(({ id, name }) => (
            <CategoryItem key={id} id={id} categoryName={name} />
          ))}
        </ul>
      </nav>
      <div className="hidden md:block w-full h-4 absolute bottom-0 left-0 backdrop-blur-[1px]" />
    </div>
  )
}
export default CategoryList;