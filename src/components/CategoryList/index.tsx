import { getTranslations } from 'next-intl/server';
import CategoryItem from "@/components/CategoryList/CategoryItem";
import { CATEGORY_MAPED_ID } from "@/static/blogs";

type CategoryListProps = {
  locale: string;
}

const CategoryList = async ({ locale }: CategoryListProps) => {
  const t = await getTranslations({ locale, namespace: 'categories' });
  const tBlog = await getTranslations({ locale, namespace: 'blog' });
  
  // カテゴリ配列を翻訳データで生成
  const categoryArray = Object.entries(CATEGORY_MAPED_ID).map(([_, id]) => ({
    id,
    name: t(id)
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