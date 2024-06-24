import CategoryItem from "@/components/CategoryList/CategoryItem";
import { CATEGORY_ARRAY } from "@/static/blogs";

const CategoryList = async () => {
  
  return (
    <div data-testid="pw-category-list">
      <div className="text-xl mb-8 px-0.5 dark:text-gray-400">Category</div>
      <nav className="md:overflow-y-scroll md:max-h-[348px] md:bg-gradient-to-t md:from-gray-50 dark:md:from-gray-700 md:to-5%">
        <ul className="divide-y-0 md:divide-y divide-gray-300 dark:divide-gray-600 flex flex-wrap gap-4 md:gap-0 md:flex-col">
          {CATEGORY_ARRAY.map(({ id, name }) => (
            <CategoryItem key={id} id={id} categoryName={name} />
          ))}
        </ul>
      </nav>
    </div>
  )
}
export default CategoryList;